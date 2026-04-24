const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEMPLATE_FILE = 'template.tex';
const OUTPUT_FILE = 'cv.pdf';

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeLatex(text) {
    if (!text) return '';
    return text
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/[&%$#_{}]/g, '\\$&')
        .replace(/\~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}')
        .replace(/€/g, '\\texteuro{}')
        .replace(/€/g, '\\EUR{}');
}

function generateExperience(experiences) {
    if (!experiences || experiences.length === 0) return '';
    
    let latex = '';
    for (const exp of experiences) {
        if (!exp.company && !exp.position) continue;
        
        const position = escapeLatex(exp.position || '');
        const company = escapeLatex(exp.company || '');
        const start = escapeLatex(exp.start || '');
        const end = escapeLatex(exp.end || '');
        const dateRange = start || end ? `${start} - ${end}` : '';
        
        latex += `\\cventry{${dateRange}}{${position}}{${company}}{}{}{}`;
        
        if (exp.details) {
            const details = escapeLatex(exp.details);
            const bullets = details.split('\n').filter(Boolean);
            for (const bullet of bullets) {
                latex += `\n\\begin{itemize}\n\\item ${bullet}\n\\end{itemize}`;
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
        
        const institution = escapeLatex(edu.institution || '');
        const program = escapeLatex(edu.program || '');
        const eduStart = escapeLatex(edu.eduStart || '');
        const eduEnd = escapeLatex(edu.eduEnd || '');
        const dateRange = eduStart || eduEnd ? `${eduStart} - ${eduEnd}` : '';
        
        latex += `\\cventry{${dateRange}}{${program}}{${institution}}{}{}{}`;
        
        if (edu.eduDetails) {
            latex += `\n\\begin{itemize}\n\\item ${escapeLatex(edu.eduDetails)}\n\\end{itemize}`;
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
        
        const title = escapeLatex(proj.projectTitle || '');
        const desc = escapeLatex(proj.projectDesc || '');
        
        latex += `\\cventry{}{${title}}{}{}{}{${desc}}\n`;
    }
    return latex;
}

function generateCerts(certs) {
    if (!certs || certs.length === 0) return '';
    
    let latex = '';
    for (const cert of certs) {
        if (!cert.certTitle && !cert.certOrg) continue;
        
        const title = escapeLatex(cert.certTitle || '');
        const org = escapeLatex(cert.certOrg || '');
        const year = escapeLatex(cert.certYear || '');
        
        latex += `\\cventry{${year}}{${title}}{${org}}{}{}{}\n`;
    }
    return latex;
}

function render(data) {
    let template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');
    
    template = template.replace(/__NAME__/g, escapeLatex(data.name || ''));
    template = template.replace(/__PHONE__/g, escapeLatex(data.phone || ''));
    template = template.replace(/__EMAIL__/g, escapeLatex(data.email || ''));
    template = template.replace(/__LOCATION__/g, escapeLatex(data.location || ''));
    template = template.replace(/__WEBSITE__/g, escapeLatex(data.website || ''));
    template = template.replace(/__SUMMARY__/g, escapeLatex(data.summary || ''));
    template = template.replace(/__EXPERIENCE__/g, generateExperience(data.experiences));
    template = template.replace(/__EDUCATION__/g, generateEducation(data.education));
    template = template.replace(/__PROJECTS__/g, generateProjects(data.projects));
    template = template.replace(/__CERTS__/g, generateCerts(data.certs));
    template = template.replace(/__SKILLS__/g, escapeLatex(data.skills || ''));
    template = template.replace(/__LANGUAGES__/g, escapeLatex(data.languages || ''));
    template = template.replace(/__OTHER__/g, data.other ? `\\section{Otros}\n${escapeLatex(data.other)}` : '');
    template = template.replace(/__PHOTO_DATA__/g, data.photo ? data.photo : '');
    
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
            throw new Error('PDF not generated');
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