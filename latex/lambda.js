const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEMPLATE_FILE = 'template.tex';
const OUTPUT_FILE = 'document.pdf';

function escapeLatex(text) {
    if (!text) return '';
    return text
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/#/g, '\\#')
        .replace(/{/g, '\\{')
        .replace(/}/g, '\\}')
        .replace(/_/g, '\\_')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}');
}

function line() {
    return '\\\\ ';
}

function generateExperience(experiences) {
    if (!experiences || experiences.length === 0) return '';
    
    let latex = '';
    for (const exp of experiences) {
        if (!exp.company && !exp.position) continue;
        
        const position = exp.position ? `\\textbf{${escapeLatex(exp.position)}}` : '';
        const company = exp.company ? `\\emph{${escapeLatex(exp.company)}}` : '';
        const dateRange = (exp.start || exp.end) ? `${escapeLatex(exp.start || '')} - ${escapeLatex(exp.end || '')}` : '';
        
        if (position) latex += position + line();
        if (company || dateRange) latex += `${company} ${dateRange}` + line();
        
        if (exp.details) {
            const bullets = exp.details.split('\n').filter(Boolean);
            for (const bullet of bullets) {
                latex += `\\item ${escapeLatex(bullet)}\n`;
            }
        }
        latex += '\n';
    }
    return latex;
}

function generateEducation(education) {
    if (!education || education.length === 0) return '';
    
    let latex = '';
    for (const edu of education) {
        if (!edu.institution && !edu.program) continue;
        
        const program = edu.program ? `\\textbf{${escapeLatex(edu.program)}}` : '';
        const institution = edu.institution ? `\\emph{${escapeLatex(edu.institution)}}` : '';
        const dateRange = (edu.eduStart || edu.eduEnd) ? `${escapeLatex(edu.eduStart || '')} - ${escapeLatex(edu.eduEnd || '')}` : '';
        
        if (program) latex += program + line();
        if (institution || dateRange) latex += `${institution} ${dateRange}` + line();
        
        if (edu.eduDetails) {
            latex += escapeLatex(edu.eduDetails) + '\n';
        }
        latex += '\n';
    }
    return latex;
}

function generateProjects(projects) {
    if (!projects || projects.length === 0) return '';
    
    let latex = '';
    for (const proj of projects) {
        if (!proj.projectTitle && !proj.projectDesc) continue;
        
        const title = proj.projectTitle ? `\\textbf{${escapeLatex(proj.projectTitle)}}` : '';
        const desc = proj.projectDesc ? escapeLatex(proj.projectDesc) : '';
        
        if (title) latex += title + line();
        if (desc) latex += desc + line();
        latex += '\n';
    }
    return latex;
}

function generateSkills(skills) {
    if (!skills || Object.keys(skills).every(k => !skills[k])) return '';
    
    const categories = [
        { key: 'languages', label: 'Languages' },
        { key: 'frontend', label: 'Frontend' },
        { key: 'backend', label: 'Backend \\& Frameworks' },
        { key: 'cloud', label: 'Cloud' },
        { key: 'devops', label: 'DevOps \\& Tools' },
        { key: 'testing', label: 'Testing' },
        { key: 'databases', label: 'Databases' }
    ];
    
    let latex = '';
    for (const cat of categories) {
        if (skills[cat.key]) {
            latex += `\\textbf{${cat.label}:} ${escapeLatex(skills[cat.key])}\n`;
        }
    }
    return latex;
}

function generateVolunteering(volunteering) {
    if (!volunteering || volunteering.length === 0) return '';
    
    let latex = '';
    for (const vol of volunteering) {
        if (!vol.title && !vol.role) continue;
        
        const title = vol.title ? `\\textbf{${escapeLatex(vol.title)}}` : '';
        const role = vol.role ? `\\emph{${escapeLatex(vol.role)}}` : '';
        const dateRange = (vol.start || vol.end) ? `${escapeLatex(vol.start || '')} - ${escapeLatex(vol.end || '')}` : '';
        
        if (title) latex += title + line();
        if (role || dateRange) latex += `${role} ${dateRange}` + line();
        
        if (vol.description) {
            const bullets = vol.description.split('\n').filter(Boolean);
            for (const bullet of bullets) {
                latex += `\\item ${escapeLatex(bullet)}\n`;
            }
        }
        latex += '\n';
    }
    return latex;
}

function generateCerts(certs) {
    if (!certs || certs.length === 0) return '';
    
    let latex = '';
    for (const cert of certs) {
        if (!cert.certTitle && !cert.certOrg) continue;
        
        const title = cert.certTitle ? `\\textbf{${escapeLatex(cert.certTitle)}}` : '';
        const org = cert.certOrg ? escapeLatex(cert.certOrg) : '';
        const year = cert.certYear ? escapeLatex(cert.certYear) : '';
        
        if (title) latex += title + line();
        if (org || year) latex += `${org} ${year}` + line();
        latex += '\n';
    }
    return latex;
}

function buildHeader(data) {
    const parts = [];
    
    if (data.name) {
        parts.push(`{\\LARGE \\textbf{${escapeLatex(data.name)}}}`);
    }
    if (data.role) {
        parts.push(`{\\normalsize ${escapeLatex(data.role)}}`);
    }
    
    const contactParts = [];
    if (data.location) contactParts.push(escapeLatex(data.location));
    if (data.phone) contactParts.push(escapeLatex(data.phone));
    if (data.email) contactParts.push(`\\href{mailto:${escapeLatex(data.email)}}{${escapeLatex(data.email)}}`);
    if (data.linkedin) contactParts.push(`\\href{${escapeLatex(data.linkedin)}}{LinkedIn}`);
    if (data.website) contactParts.push(`\\href{${escapeLatex(data.website)}}{Website}`);
    
    if (contactParts.length > 0) {
        parts.push(contactParts.join(' \\\\ '));
    }
    
    return parts.join('\\\\ ');
}

function render(data) {
    let template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');
    
    template = template.replace('__HEADER__', buildHeader(data));
    template = template.replace('__SUMMARY__', escapeLatex(data.summary || ''));
    template = template.replace('__EXPERIENCE__', generateExperience(data.experiences));
    template = template.replace('__SKILLS__', generateSkills(data.skills));
    template = template.replace('__EDUCATION__', generateEducation(data.education));
    template = template.replace('__CERTS__', generateCerts(data.certs));
    template = template.replace('__VOLUNTEERING__', generateVolunteering(data.volunteering));
    template = template.replace('__PROJECTS__', generateProjects(data.projects));
    
    fs.writeFileSync('document.tex', template);
    return template;
}

async function compileLatex() {
    return new Promise((resolve, reject) => {
        const args = ['-interaction=nonstopmode', '-halt-on-error', 'document.tex'];
        const proc = spawn('pdflatex', args, { cwd: '/task' });
        
        let stdout = '';
        let stderr = '';
        
        proc.stdout.on('data', d => stdout += d);
        proc.stderr.on('data', d => stderr += d);
        
        proc.on('close', code => {
            if (code === 0) {
                resolve({ success: true, stdout, stderr });
            } else {
                reject(new Error(`LaTeX error: ${stderr || stdout}`));
            }
        });
        
        proc.on('error', err => reject(err));
    });
}

async function handler(event) {
    try {
        const data = event.body ? JSON.parse(event.body) : event;
        
        if (!data.name) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Name is required' })
            };
        }
        
        console.log('Rendering template...');
        render(data);
        
        console.log('Compiling with pdflatex (1st pass)...');
        await compileLatex();
        
        console.log('Compiling with pdflatex (2nd pass)...');
        await compileLatex();
        
        if (!fs.existsSync(OUTPUT_FILE)) {
            const logContent = fs.readFileSync('document.log', 'utf-8');
            throw new Error(`PDF not generated. Log: ${logContent.slice(-1000)}`);
        }
        
        const pdfBuffer = fs.readFileSync(OUTPUT_FILE);
        const pdfBase64 = pdfBuffer.toString('base64');
        
        const filename = `CV_${data.name.replace(/\s+/g, '_')}.pdf`;
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'X-File-Name': filename
            },
            body: pdfBase64,
            isBase64Encoded: true
        };
        
    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: error.message })
        };
    }
}

module.exports = { handler };

if (require.main === module) {
    const testData = {
        name: 'David Barrera',
        email: 'david@example.com',
        phone: '+57 300 123 4567',
        location: 'Bogotá, Colombia',
        summary: 'Ingeniero de Software con experiencia en desarrollo full-stack y cloud.',
        experiences: [{
            company: 'Tech Corp',
            position: 'Software Engineer',
            start: '2020',
            end: 'Presente',
            details: 'Desarrollo de APIs\nliderazgo de equipo'
        }],
        education: [{
            institution: 'Universidad Nacional',
            program: 'Ing. Sistemas',
            eduStart: '2015',
            eduEnd: '2019'
        }],
        skills: 'JavaScript, Python, AWS, Docker',
        languages: 'Español (nativo), Inglés (B2)'
    };
    
    handler(testData).then(result => {
        console.log('Result:', result.statusCode);
        if (result.statusCode === 200) {
            fs.writeFileSync('test_cv.pdf', Buffer.from(result.body, 'base64'));
            console.log('PDF generated: test_cv.pdf');
        }
    }).catch(console.error);
}