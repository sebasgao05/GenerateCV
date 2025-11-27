// Lógica del formulario y generación de PDF (vanilla JS + jsPDF + i18next).
(function () {
  let experienceList;
  let educationList;
  let customList;
  let projectsList;
  let certList;
  let messageEl;
  let toggleLangBtn;
  let previewFrame;
  let downloadBtn;
  let toggleThemeBtn;
  let lastDoc = null;
  let lastPreviewUrl = "";

  const translations = {
    es: {
      pill: "Lista completa en PDF",
      hero_title: "Genera tu CV con los datos clave",
      hero_body: "Completa los campos obligatorios y agrega secciones extras si quieres. La experiencia, educación, habilidades e idiomas son obligatorios para crear el PDF.",
      hero_tip: "Tip: Los archivos en <strong>baseCV/</strong> son referencia del contenido esperado; adapta los campos a tu perfil.",
      section_required: "Datos obligatorios",
      section_experience: "Experiencia",
      section_education: "Educación",
      section_skills: "Habilidades",
      section_languages: "Idiomas",
      section_custom: "Secciones libres (opcional)",
      hint_experience: "Suma tantos roles como necesites. Al menos uno es obligatorio.",
      hint_custom: "Úsalo para proyectos, certificaciones, voluntariado u otro apartado personalizado.",
      label_name: "Nombre completo",
      label_role: "Rol o título",
      label_email: "Email",
      label_phone: "Teléfono",
      label_location: "Ubicación",
      label_summary: "Perfil profesional",
      label_website: "Sitio web (opcional)",
      label_linkedin: "LinkedIn (opcional)",
      label_font: "Fuente",
      section_certs: "Cursos y certificaciones",
      btn_add_cert: "Agregar certificado",
      label_cert_title: "Certificación",
      label_cert_org: "Organización",
      label_cert_year: "Año",
      hint_certs: "Incluye certificaciones o cursos relevantes.",
      section_projects: "Proyectos personales",
      label_project_title: "Título",
      label_project_desc: "Descripción",
      btn_add_project: "Agregar proyecto",
      hint_projects: "Añade título y descripción breve de cada proyecto.",
      section_other: "Otras competencias",
      label_other: "Texto libre",
      label_skills: "Lista separada por comas",
      label_languages: "Con nivel o certificación",
      label_photo: "Foto (solo imágenes, opcional)",
      btn_add_experience: "Agregar experiencia",
      btn_add_education: "Agregar educación",
      btn_add_custom: "Agregar bloque",
      btn_generate: "Vista previa",
      btn_reset: "Limpiar formulario",
      btn_download: "Descargar PDF",
      btn_theme_dark: "Tema oscuro",
      btn_theme_light: "Tema claro",
      error_required_lists: "Añade al menos una experiencia, una educación y completa habilidades e idiomas.",
      error_required_fields: "Revisa los campos obligatorios marcados con *.",
      success_ready: "Vista previa lista.",
      preview_title: "Vista previa del PDF",
      placeholders: {
        placeholder_name: "Ej. David Barrera",
        placeholder_role: "Ej. Ingeniero de Software",
        placeholder_email: "correo@ejemplo.com",
        placeholder_phone: "+57 300 000 0000",
        placeholder_location: "Ciudad, País",
        placeholder_website: "https://tu-sitio.com",
        placeholder_linkedin: "https://linkedin.com/in/usuario",
        placeholder_summary: "Resumen breve de tu experiencia y enfoque.",
        placeholder_cert_title: "Certificación lograda",
        placeholder_cert_org: "Empresa u organización",
        placeholder_cert_year: "Año",
        placeholder_project_title: "Título del proyecto",
        placeholder_project_desc: "Descripción breve",
        placeholder_skills: "Go, Python, AWS, SQL, liderazgo",
        placeholder_languages: "Español (nativo), Inglés (B2)",
        company: "Empresa",
        position: "Cargo",
        start: "Inicio",
        end: "Fin",
        details: "Puntos clave separados por línea",
        institution: "Universidad / Instituto",
        program: "Programa o título",
        eduStart: "Inicio",
        eduEnd: "Fin",
        eduDetails: "Enfoque, énfasis, logros",
        customTitle: "Proyectos, Certificaciones...",
        customBody: "Texto libre, lista o descripciones"
      },
      pdfSections: {
        profile: "Perfil",
        experience: "Experiencia",
        education: "Educación",
        skills: "Habilidades",
        languages: "Idiomas",
        custom: "Sección"
      },
      card: {
        company: "Empresa",
        position: "Cargo",
        start: "Inicio",
        end: "Fin",
        institution: "Institución",
        program: "Programa",
        description: "Descripción",
        customTitle: "Título",
        customContent: "Contenido"
      }
    },
    en: {
      pill: "Full PDF ready",
      hero_title: "Generate your CV with key data",
      hero_body: "Fill the required fields and add extra sections if needed. Experience, education, skills and languages are required to create the PDF.",
      hero_tip: "Tip: Files in <strong>baseCV/</strong> are just references; adapt the fields to your profile.",
      section_required: "Required data",
      section_experience: "Experience",
      section_education: "Education",
      section_skills: "Skills",
      section_languages: "Languages",
      section_custom: "Free sections (optional)",
      hint_experience: "Add as many roles as you need. At least one is required.",
      hint_custom: "Use it for projects, certifications, volunteering or any custom section.",
      label_name: "Full name",
      label_role: "Role or title",
      label_email: "Email",
      label_phone: "Phone",
      label_location: "Location",
      label_summary: "Professional summary",
      label_website: "Website (optional)",
      label_linkedin: "LinkedIn (optional)",
      label_font: "Font",
      section_certs: "Courses & Certifications",
      btn_add_cert: "Add certificate",
      label_cert_title: "Certification",
      label_cert_org: "Organization",
      label_cert_year: "Year",
      hint_certs: "Add relevant courses or certifications.",
      section_projects: "Personal projects",
      label_project_title: "Title",
      label_project_desc: "Description",
      btn_add_project: "Add project",
      hint_projects: "Add title and a short description for each project.",
      section_other: "Other competencies",
      label_other: "Free text",
      label_skills: "Comma separated list",
      label_languages: "With level or certification",
      label_photo: "Photo (images only, optional)",
      btn_add_experience: "Add experience",
      btn_add_education: "Add education",
      btn_add_custom: "Add block",
      btn_generate: "Preview",
      btn_reset: "Clear form",
      btn_download: "Download PDF",
      btn_theme_dark: "Dark theme",
      btn_theme_light: "Light theme",
      error_required_lists: "Add at least one experience, one education and fill skills and languages.",
      error_required_fields: "Check the required fields marked with *.",
      success_ready: "Preview ready.",
      preview_title: "PDF preview",
      placeholders: {
        placeholder_name: "e.g. David Barrera",
        placeholder_role: "e.g. Software Engineer",
        placeholder_email: "email@example.com",
        placeholder_phone: "+1 555 123 4567",
        placeholder_location: "City, Country",
        placeholder_website: "https://your-site.com",
        placeholder_linkedin: "https://linkedin.com/in/you",
        placeholder_summary: "Short summary about your experience and focus.",
        placeholder_cert_title: "Certification achieved",
        placeholder_cert_org: "Organization",
        placeholder_cert_year: "Year",
        placeholder_project_title: "Project title",
        placeholder_project_desc: "Short description",
        placeholder_skills: "Go, Python, AWS, SQL, leadership",
        placeholder_languages: "Spanish (native), English (B2)",
        company: "Company",
        position: "Position",
        start: "Start",
        end: "End",
        details: "Key points separated by line",
        institution: "University / School",
        program: "Program or degree",
        eduStart: "Start",
        eduEnd: "End",
        eduDetails: "Focus, emphasis, achievements",
        customTitle: "Projects, Certifications...",
        customBody: "Free text, list or descriptions"
      },
      pdfSections: {
        profile: "Profile",
        experience: "Experience",
        education: "Education",
        skills: "Skills",
        languages: "Languages",
        custom: "Section"
      },
      card: {
        company: "Company",
        position: "Position",
        start: "Start",
        end: "End",
        institution: "Institution",
        program: "Program",
        description: "Description",
        customTitle: "Title",
        customContent: "Content"
      }
    }
  };

  const textMap = [
    ["pill", "[data-i18n='pill']"],
    ["hero_title", "[data-i18n='hero_title']"],
    ["hero_body", "[data-i18n='hero_body']"],
    ["hero_tip", "[data-i18n='hero_tip']"],
    ["section_required", "[data-i18n='section_required']"],
    ["section_experience", "[data-i18n='section_experience']"],
    ["section_education", "[data-i18n='section_education']"],
    ["section_skills", "[data-i18n='section_skills']"],
    ["section_languages", "[data-i18n='section_languages']"],
    ["section_custom", "[data-i18n='section_custom']"],
    ["hint_experience", "[data-i18n='hint_experience']"],
    ["hint_custom", "[data-i18n='hint_custom']"],
    ["label_name", "[data-i18n='label_name']"],
    ["label_role", "[data-i18n='label_role']"],
    ["label_email", "[data-i18n='label_email']"],
    ["label_phone", "[data-i18n='label_phone']"],
    ["label_location", "[data-i18n='label_location']"],
    ["label_summary", "[data-i18n='label_summary']"],
    ["label_website", "[data-i18n='label_website']"],
    ["label_linkedin", "[data-i18n='label_linkedin']"],
    ["label_font", "[data-i18n='label_font']"],
    ["section_certs", "[data-i18n='section_certs']"],
    ["btn_add_cert", "[data-i18n='btn_add_cert']"],
    ["label_cert_title", "[data-i18n='label_cert_title']"],
    ["label_cert_org", "[data-i18n='label_cert_org']"],
    ["label_cert_year", "[data-i18n='label_cert_year']"],
    ["hint_certs", "[data-i18n='hint_certs']"],
    ["section_projects", "[data-i18n='section_projects']"],
    ["label_project_title", "[data-i18n='label_project_title']"],
    ["label_project_desc", "[data-i18n='label_project_desc']"],
    ["btn_add_project", "[data-i18n='btn_add_project']"],
    ["hint_projects", "[data-i18n='hint_projects']"],
    ["section_other", "[data-i18n='section_other']"],
    ["label_other", "[data-i18n='label_other']"],
    ["label_skills", "[data-i18n='label_skills']"],
    ["label_languages", "[data-i18n='label_languages']"],
    ["label_photo", "[data-i18n='label_photo']"],
    ["btn_add_experience", "[data-i18n='btn_add_experience']"],
    ["btn_add_education", "[data-i18n='btn_add_education']"],
  ["btn_add_custom", "[data-i18n='btn_add_custom']"],
  ["btn_generate", "[data-i18n='btn_generate']"],
  ["btn_reset", "[data-i18n='btn_reset']"],
  ["btn_download", "[data-i18n='btn_download']"],
  ["preview_title", "[data-i18n='preview_title']"],
  ["btn_theme_dark", "#toggle-theme"],
  ["btn_theme_light", "#toggle-theme"]
];

  document.addEventListener("DOMContentLoaded", () => {
    experienceList = document.getElementById("experience-list");
    educationList = document.getElementById("education-list");
    customList = document.getElementById("custom-list");
    projectsList = document.getElementById("projects-list");
    certList = document.getElementById("cert-list");
    messageEl = document.getElementById("form-message");
    toggleLangBtn = document.getElementById("toggle-lang");
    toggleThemeBtn = document.getElementById("toggle-theme");
    previewFrame = document.getElementById("pdf-preview");
    downloadBtn = document.getElementById("download-btn");

    if (!window.i18next) {
      showMessage("No se pudo cargar i18next (CDN). Revisa tu conexión.", "error");
      return;
    }

    i18next.init({
      lng: "es",
      resources: { es: { translation: translations.es }, en: { translation: translations.en } }
    }).then(() => {
      applyTranslations();
      addExperience();
      addEducation();
      setPlaceholders();
      refreshCardTexts();
    });

    toggleLangBtn.addEventListener("click", () => {
      const nextLang = i18next.language === "es" ? "en" : "es";
      i18next.changeLanguage(nextLang).then(applyTranslations);
    });

    toggleThemeBtn.addEventListener("click", () => {
      const body = document.body;
      body.classList.toggle("dark-mode");
      const key = body.classList.contains("dark-mode") ? "btn_theme_light" : "btn_theme_dark";
      toggleThemeBtn.textContent = i18next.t(key);
    });

    document.getElementById("add-project").addEventListener("click", () => { addProject(); saveCurrentState(); });
    document.getElementById("add-experience").addEventListener("click", () => { addExperience(); saveCurrentState(); });
    document.getElementById("add-education").addEventListener("click", () => { addEducation(); saveCurrentState(); });
    document.getElementById("add-custom").addEventListener("click", () => { addCustomSection(); saveCurrentState(); });
    document.getElementById("add-cert").addEventListener("click", () => { addCert(); saveCurrentState(); });
    document.getElementById("font-select").addEventListener("change", () => { getSelectedFont(); saveCurrentState(); });
    const photoInput = document.getElementById("photo");
    if (photoInput) {
      photoInput.addEventListener("change", () => {
        const file = photoInput.files && photoInput.files[0];
        if (file && !file.type.toLowerCase().startsWith("image/")) {
          alert("Solo se permiten archivos de imagen (png, jpg, jpeg).");
          photoInput.value = "";
        }
      });
    }

    const formEl = document.getElementById("cv-form");
    formEl.addEventListener("submit", handleSubmit);
    formEl.addEventListener("reset", handleReset);
    downloadBtn.addEventListener("click", handleDownload);
    formEl.addEventListener("input", () => saveCurrentState(), true);
    formEl.addEventListener("change", () => saveCurrentState(), true);
    loadState();
  });

  function setPlaceholders() {
    document.querySelectorAll("[data-placeholder]").forEach((el) => {
      const key = el.dataset.placeholder;
      el.placeholder = i18next.t(`placeholders.${key}`);
    });
  }

  function refreshCardTexts() {
    document.querySelectorAll("[data-label-key]").forEach((el) => {
      el.textContent = i18next.t(el.dataset.labelKey);
    });
  }

  function applyTranslations() {
    textMap.forEach(([key, selector]) => {
      const el = document.querySelector(selector);
      if (el) el.innerHTML = i18next.t(key);
    });
    document.querySelectorAll("[data-i18n-text]").forEach((el) => {
      el.textContent = i18next.t(el.dataset.i18nText);
    });
    if (toggleLangBtn) {
      toggleLangBtn.textContent = i18next.language === "es" ? "ES / EN" : "EN / ES";
    }
    if (toggleThemeBtn) {
      const key = document.body.classList.contains("dark-mode") ? "btn_theme_light" : "btn_theme_dark";
      toggleThemeBtn.textContent = i18next.t(key);
    }
    setPlaceholders();
    experienceList?.querySelectorAll("input, textarea").forEach(setCardPlaceholder);
    educationList?.querySelectorAll("input, textarea").forEach(setCardPlaceholder);
    customList?.querySelectorAll("input, textarea").forEach(setCardPlaceholder);
    refreshCardTexts();
    getSelectedFont();
  }

  const removeItem = (container, item) => { container.removeChild(item); saveCurrentState(); };

  function setCardPlaceholder(el) {
    const key = el.getAttribute("data-ph-key");
    if (key) el.placeholder = i18next.t(`placeholders.${key}`);
  }

  function addExperience(prefill = {}) {
    if (!experienceList) return;
    const wrapper = document.createElement("div");
    wrapper.className = "item";
    wrapper.innerHTML = `
      <button type="button" class="remove" aria-label="Eliminar experiencia">&times;</button>
      <label data-label-key="card.company">${i18next.t("card.company")}</label>
      <input name="company" type="text" data-ph-key="company" value="${prefill.company || ""}">
      <label style="margin-top:8px;" data-label-key="card.position">${i18next.t("card.position")}</label>
      <input name="position" type="text" data-ph-key="position" value="${prefill.position || ""}">
      <div class="grid" style="margin-top:8px;">
        <div>
          <small data-label-key="card.start">${i18next.t("card.start")}</small>
          <input name="start" type="text" data-ph-key="start" value="${prefill.start || ""}">
        </div>
        <div>
          <small data-label-key="card.end">${i18next.t("card.end")}</small>
          <input name="end" type="text" data-ph-key="end" value="${prefill.end || ""}">
        </div>
      </div>
      <label style="margin-top:8px;" data-label-key="card.description">${i18next.t("card.description")}</label>
      <textarea name="details" rows="3" data-ph-key="details">${prefill.details || ""}</textarea>
    `;
    wrapper.querySelector(".remove").addEventListener("click", () => removeItem(experienceList, wrapper));
    wrapper.querySelectorAll("input, textarea").forEach(setCardPlaceholder);
    experienceList.appendChild(wrapper);
  }

  function addEducation(prefill = {}) {
    if (!educationList) return;
    const wrapper = document.createElement("div");
    wrapper.className = "item";
    wrapper.innerHTML = `
      <button type="button" class="remove" aria-label="Eliminar educación">&times;</button>
      <label data-label-key="card.institution">${i18next.t("card.institution")}</label>
      <input name="institution" type="text" data-ph-key="institution" value="${prefill.institution || ""}">
      <label style="margin-top:8px;" data-label-key="card.program">${i18next.t("card.program")}</label>
      <input name="program" type="text" data-ph-key="program" value="${prefill.program || ""}">
      <div class="grid" style="margin-top:8px;">
        <div>
          <small data-label-key="card.start">${i18next.t("card.start")}</small>
          <input name="eduStart" type="text" data-ph-key="eduStart" value="${prefill.eduStart || ""}">
        </div>
        <div>
          <small data-label-key="card.end">${i18next.t("card.end")}</small>
          <input name="eduEnd" type="text" data-ph-key="eduEnd" value="${prefill.eduEnd || ""}">
        </div>
      </div>
      <label style="margin-top:8px;" data-label-key="card.description">${i18next.t("card.description")}</label>
      <textarea name="eduDetails" rows="2" data-ph-key="eduDetails">${prefill.eduDetails || ""}</textarea>
    `;
    wrapper.querySelector(".remove").addEventListener("click", () => removeItem(educationList, wrapper));
    wrapper.querySelectorAll("input, textarea").forEach(setCardPlaceholder);
    educationList.appendChild(wrapper);
  }

  function addCustomSection(prefill = {}) {
    if (!customList) return;
    const wrapper = document.createElement("div");
    wrapper.className = "item";
    wrapper.innerHTML = `
      <button type="button" class="remove" aria-label="Eliminar bloque libre">&times;</button>
      <label data-label-key="card.customTitle">${i18next.t("card.customTitle")}</label>
      <input name="customTitle" type="text" data-ph-key="customTitle" value="${prefill.customTitle || ""}">
      <label style="margin-top:8px;" data-label-key="card.customContent">${i18next.t("card.customContent")}</label>
      <textarea name="customBody" rows="3" data-ph-key="customBody">${prefill.customBody || ""}</textarea>
    `;
    wrapper.querySelector(".remove").addEventListener("click", () => removeItem(customList, wrapper));
    wrapper.querySelectorAll("input, textarea").forEach(setCardPlaceholder);
    customList.appendChild(wrapper);
  }

  function addProject(prefill = {}) {
    if (!projectsList) return;
    const wrapper = document.createElement("div");
    wrapper.className = "item";
    wrapper.innerHTML = `
      <button type="button" class="remove" aria-label="Eliminar proyecto">&times;</button>
      <label data-label-key="label_project_title">${i18next.t("label_project_title")}</label>
      <input name="projectTitle" type="text" data-ph-key="placeholder_project_title" value="${prefill.projectTitle || ""}">
      <label style="margin-top:8px;" data-label-key="label_project_desc">${i18next.t("label_project_desc")}</label>
      <textarea name="projectDesc" rows="3" data-ph-key="placeholder_project_desc">${prefill.projectDesc || ""}</textarea>
    `;
    wrapper.querySelector(".remove").addEventListener("click", () => removeItem(projectsList, wrapper));
    wrapper.querySelectorAll("input, textarea").forEach(setCardPlaceholder);
    projectsList.appendChild(wrapper);
  }

  function addCert(prefill = {}) {
    if (!certList) return;
    const wrapper = document.createElement("div");
    wrapper.className = "item";
    wrapper.innerHTML = `
      <button type="button" class="remove" aria-label="Eliminar certificado">&times;</button>
      <label data-label-key="label_cert_title">${i18next.t("label_cert_title")}</label>
      <input name="certTitle" type="text" data-ph-key="placeholder_cert_title" value="${prefill.certTitle || ""}">
      <label style="margin-top:8px;" data-label-key="label_cert_org">${i18next.t("label_cert_org")}</label>
      <input name="certOrg" type="text" data-ph-key="placeholder_cert_org" value="${prefill.certOrg || ""}">
      <label style="margin-top:8px;" data-label-key="label_cert_year">${i18next.t("label_cert_year")}</label>
      <input name="certYear" type="text" data-ph-key="placeholder_cert_year" value="${prefill.certYear || ""}">
    `;
    wrapper.querySelector(".remove").addEventListener("click", () => removeItem(certList, wrapper));
    wrapper.querySelectorAll("input, textarea").forEach(setCardPlaceholder);
    certList.appendChild(wrapper);
  }

  function gatherList(container, selector) {
    return Array.from(container.querySelectorAll(selector))
      .map((card) => {
        const data = {};
        card.querySelectorAll("input, textarea").forEach((field) => {
          data[field.name] = field.value.trim();
        });
        return data;
      })
      .filter((item) => Object.values(item).some(Boolean));
  }

  function showMessage(text, type = "error") {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.style.color = type === "error" ? "#b91c1c" : "#15803d";
  }

  function validateRequiredCollections(experiences, education, skills, languages) {
    const hasExp = experiences.length > 0 && experiences.some((e) => e.company || e.position || e.details);
    const hasEdu = education.length > 0 && education.some((e) => e.institution || e.program);
    const hasSkills = Boolean(skills);
    const hasLangs = Boolean(languages);
    return hasExp && hasEdu && hasSkills && hasLangs;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await ensureJsPDF();
    if (!window.jspdf) {
      showMessage("No se pudo cargar jsPDF. Verifica el archivo local en libs/jspdf.umd.min.js.", "error");
      return;
    }
    const { jsPDF } = window.jspdf;
    const form = event.target;

    const name = document.getElementById("name").value.trim();
    const role = document.getElementById("role").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const location = document.getElementById("location").value.trim();
    const website = document.getElementById("website").value.trim();
    const linkedin = document.getElementById("linkedin").value.trim();
    const summary = document.getElementById("summary").value.trim();
    const skills = document.getElementById("skills").value.trim();
    const languages = document.getElementById("languages").value.trim();
    const experiences = gatherList(experienceList, ".item");
    const education = gatherList(educationList, ".item");
    const projects = gatherList(projectsList, ".item");
    const certs = gatherList(certList, ".item");
    const customSections = gatherList(customList, ".item");
    const photoInput = document.getElementById("photo");

    if (!validateRequiredCollections(experiences, education, skills, languages)) {
      showMessage(i18next.t("error_required_lists"));
      return;
    }

    if (!form.checkValidity()) {
      showMessage(i18next.t("error_required_fields"));
      form.reportValidity();
      saveCurrentState();
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const maxWidth = pageWidth - margin * 2;
    let y = 18;

    const ensureSpace = (lineHeight) => {
      if (y + lineHeight > 280) {
        doc.addPage();
        y = 20;
      }
    };

    const addSection = (title, lines) => {
      if (!lines.length) return;
      ensureSpace(10);
      doc.setFont(getSelectedFont(), "bolditalic");
      doc.setFontSize(13);
      doc.setTextColor(0);
      doc.text(title, margin + 4, y);
      y += 6;
      doc.setFont(getSelectedFont(), "normal");
      doc.setFontSize(11);
      doc.setTextColor(30);
      lines.forEach((line) => {
        if (!line) {
          y += 4;
          return;
        }
        const wrapped = doc.splitTextToSize(line, maxWidth);
        wrapped.forEach((wLine) => {
          ensureSpace(6);
          doc.text(wLine, margin + 4, y);
          y += 6;
        });
      });
      y += 4;
    };

    doc.setFont(getSelectedFont(), "bold");
    doc.setFontSize(22);
    doc.text(name || i18next.t("label_name"), margin, y);
    y += 8;
    doc.setFontSize(14);
    doc.setTextColor(80);
    doc.text(role || i18next.t("label_role"), margin, y);
    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(40);
    const contacts = [`${email} • ${phone} • ${location}`];
    contacts.forEach((c) => {
      const wrapped = doc.splitTextToSize(c, maxWidth);
      wrapped.forEach((line) => {
        ensureSpace(6);
        doc.text(line, margin, y);
        y += 6;
      });
    });
    if (website) {
      ensureSpace(6);
      doc.setTextColor(0, 0, 255);
      doc.textWithLink(website, margin, y, { url: website });
      y += 6;
    }
    if (linkedin) {
      ensureSpace(6);
      doc.setTextColor(0, 0, 255);
      doc.textWithLink(linkedin, margin, y, { url: linkedin });
      y += 6;
    }
    doc.setTextColor(40);
    y += 2;

    if (photoInput.files && photoInput.files[0]) {
      const file = photoInput.files[0];
      const imgData = await fileToDataURL(file);
      const imgProps = doc.getImageProperties(imgData);
      const imgWidth = 32;
      const imgHeight = Math.min((imgProps.height * imgWidth) / imgProps.width, 42);
      const format = file.type.toLowerCase().includes("png") ? "PNG" : "JPEG";
      doc.addImage(imgData, format, doc.internal.pageSize.getWidth() - imgWidth - margin, 14, imgWidth, imgHeight);
    }

    addSection(i18next.t("pdfSections.profile"), doc.splitTextToSize(summary, maxWidth));

    const projLines = [];
    projects.forEach((p) => {
      if (!(p.projectTitle || p.projectDesc)) return;
      projLines.push(`${p.projectTitle || i18next.t("label_project_title")}`);
      if (p.projectDesc) projLines.push(`• ${p.projectDesc}`);
      projLines.push("");
    });
    addSection(i18next.t("section_projects"), projLines);

    const expLines = [];
    experiences.forEach((exp) => {
      if (!(exp.company || exp.position || exp.details)) return;
      expLines.push(exp.position || i18next.t("card.position"));
      expLines.push(`${exp.company || i18next.t("card.company")} | ${exp.start || i18next.t("card.start")} - ${exp.end || i18next.t("card.end")}`);
      exp.details.split("\n").filter(Boolean).forEach((bullet) => {
        expLines.push(`• ${bullet}`);
      });
      expLines.push("");
    });
    addSection(i18next.t("pdfSections.experience"), expLines);

    const eduLines = [];
    education.forEach((edu) => {
      if (!(edu.institution || edu.program)) return;
      eduLines.push(edu.institution || i18next.t("card.institution"));
      eduLines.push(`${edu.program || i18next.t("card.program")} | ${edu.eduStart || i18next.t("card.start")} - ${edu.eduEnd || i18next.t("card.end")}`);
      if (edu.eduDetails) eduLines.push(`• ${edu.eduDetails}`);
      eduLines.push("");
    });
    addSection(i18next.t("pdfSections.education"), eduLines);

    const certLines = [];
    certs.forEach((c) => {
      if (!(c.certTitle || c.certOrg || c.certYear)) return;
      certLines.push(c.certTitle || i18next.t("label_cert_title"));
      certLines.push(`${c.certOrg || i18next.t("label_cert_org")} | ${c.certYear || ""}`);
      certLines.push("");
    });
    addSection(i18next.t("section_certs"), certLines);

    if (skills) addSection(i18next.t("pdfSections.skills"), [`Técnicas: ${skills.split(",").map((s) => s.trim()).filter(Boolean).join(" | ")}`]);
    if (languages) addSection(i18next.t("pdfSections.languages"), languages.split(",").map((l) => `• ${l.trim()}`).filter(Boolean));
    const other = document.getElementById("other_skills").value.trim();
    if (other) addSection(i18next.t("section_other"), [`Otros: ${other}`]);

    customSections.forEach((block) => {
      if (!(block.customTitle || block.customBody)) return;
      addSection(block.customTitle || i18next.t("pdfSections.custom"), block.customBody.split("\n").filter(Boolean));
    });

    lastDoc = doc;
    const blobUrl = doc.output("bloburl");
    if (lastPreviewUrl) URL.revokeObjectURL(lastPreviewUrl);
    lastPreviewUrl = blobUrl;
    previewFrame.src = blobUrl;
    downloadBtn.disabled = false;
    showMessage(i18next.t("success_ready"), "success");
    saveCurrentState();
  }

  function handleDownload() {
    if (lastDoc) {
      const name = document.getElementById("name").value.trim();
      lastDoc.save(`${name || "CV"}.pdf`);
    }
  }

  function getSelectedFont() {
    const select = document.getElementById("font-select");
    if (!select) return "times";
    const value = select.value || "times";
    // Actualizamos la fuente en la interfaz para que coincida.
    document.documentElement.style.setProperty("--font-family", fontToCss(value));
    return value;
  }

  function fontToCss(value) {
    switch (value) {
      case "helvetica":
        return '"Helvetica", "Arial", sans-serif';
      case "courier":
        return '"Courier New", Courier, monospace';
      default:
        return '"Times New Roman", Times, serif';
    }
  }

  function handleReset() {
    setTimeout(() => {
      showMessage("");
      previewFrame.src = "";
      downloadBtn.disabled = true;
      lastDoc = null;
      if (lastPreviewUrl) {
        URL.revokeObjectURL(lastPreviewUrl);
        lastPreviewUrl = "";
      }
      localStorage.removeItem(STORAGE_KEY);
    }, 0);
  }

  function saveCurrentState() {
    try {
      const state = {
        name: document.getElementById("name").value,
        role: document.getElementById("role").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        location: document.getElementById("location").value,
        website: document.getElementById("website").value,
        linkedin: document.getElementById("linkedin").value,
        summary: document.getElementById("summary").value,
        skills: document.getElementById("skills").value,
        languages: document.getElementById("languages").value,
        other: document.getElementById("other_skills")?.value || "",
        font: document.getElementById("font-select").value,
        themeDark: document.body.classList.contains("dark-mode"),
        experiences: gatherList(experienceList, ".item"),
        education: gatherList(educationList, ".item"),
        projects: gatherList(projectsList, ".item"),
        certs: gatherList(certList, ".item"),
        custom: gatherList(customList, ".item")
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore storage issues
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        addExperience();
        addEducation();
        return;
      }
      const state = JSON.parse(raw);
      [experienceList, educationList, projectsList, certList, customList].forEach((list) => {
        if (list) list.innerHTML = "";
      });
      document.getElementById("name").value = state.name || "";
      document.getElementById("role").value = state.role || "";
      document.getElementById("email").value = state.email || "";
      document.getElementById("phone").value = state.phone || "";
      document.getElementById("location").value = state.location || "";
      document.getElementById("website").value = state.website || "";
      document.getElementById("linkedin").value = state.linkedin || "";
      document.getElementById("summary").value = state.summary || "";
      document.getElementById("skills").value = state.skills || "";
      document.getElementById("languages").value = state.languages || "";
      if (document.getElementById("other_skills")) document.getElementById("other_skills").value = state.other || "";
      document.getElementById("font-select").value = state.font || "times";
      getSelectedFont();
      if (state.themeDark) document.body.classList.add("dark-mode"); else document.body.classList.remove("dark-mode");
      (state.experiences || []).forEach((item) => addExperience(item));
      (state.education || []).forEach((item) => addEducation(item));
      (state.projects || []).forEach((item) => addProject(item));
      (state.certs || []).forEach((item) => addCert(item));
      (state.custom || []).forEach((item) => addCustomSection(item));
      if (experienceList && experienceList.children.length === 0) addExperience();
      if (educationList && educationList.children.length === 0) addEducation();
    } catch (e) {
      addExperience();
      addEducation();
    }
  }

  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function ensureJsPDF() {
    if (window.jspdf) return;
    // Si no está cargado, intenta cargar desde el archivo local.
    await loadScript("libs/jspdf.umd.min.js");
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing && existing.dataset.loaded === "true") return resolve();
      const script = existing || document.createElement("script");
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        script.dataset.loaded = "true";
        resolve();
      };
      script.onerror = reject;
      if (!existing) document.head.appendChild(script);
    });
  }
})();
