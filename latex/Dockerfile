FROM node:20-bookworm-slim

WORKDIR /task

# Instalar texlive mínimo (~300MB)
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-pictures \
    texlive-lang-spanish \
    texlive-lang-english \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && ln -s /usr/share/texlive/texmf-dist /usr/share/texlive/texmf-dist \
    && tlmgr install --no-installedambas moderncv 2>/dev/null || true

COPY lambda.js ./
COPY template.tex ./

EXPOSE 8080

CMD ["node", "lambda.js"]