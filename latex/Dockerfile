FROM node:20-bookworm-slim

WORKDIR /task

RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-latex-recommended \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY lambda.js ./
COPY template.tex ./

CMD ["node", "lambda.js"]