# QRCraft Studio

<div align="center">

[![Live Demo](https://img.shields.io/badge/Demo-Online%20(GitHub%20Pages)-58DB91?style=for-the-badge&logo=github)](https://pedrobosa.github.io/QRCraft/)
[![License: MIT](https://img.shields.io/badge/License-MIT-C77DFF?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Author](https://img.shields.io/badge/Author-PedroBosa-4F46E5?style=for-the-badge&logo=github)](https://github.com/PedroBosa)

<br />

[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-58DB91?style=flat)](#)
[![Zero-Backend](https://img.shields.io/badge/Zero--Backend-Offline%20First-22D3EE?style=flat)](#)

<p align="center">
  <strong>Estúdio profissional de alta densidade para engenharia, design e validação óptica de QR Codes.</strong><br>
  100% Client-Side (Zero-Backend) • Padrão Oficial PIX (BRCode EMV + CRC16) • Diagnóstico Óptico em Tempo Real • Exportação até 4K, Vetor SVG e PDF A4.
</p>

</div>

---

## ⚡ Por que o QRCraft?

A maioria dos geradores de QR Code online sofre de problemas graves: armazenam dados sensíveis em servidores desconhecidos, dependem de APIs lentas, inserem rastreadores não solicitados ou cobram assinaturas para downloads em alta definição.

O **QRCraft Studio** foi projetado seguindo as diretrizes visuais da **Linear, Vercel Geist e Raycast**, unindo privacidade absoluta a ferramentas avançadas de design:

- **🔒 Privacidade Total (Zero-Backend):** Todos os dados (chaves financeiras, senhas Wi-Fi, contatos pessoais) são compilados estritamente na memória do seu navegador. Zero chamadas a servidores externos.
- **🇧🇷 Padrão Oficial PIX (Banco Central):** Algoritmo próprio em conformidade com o padrão EMVCo, com sanitização de chaves, campos TLV (*Tag-Length-Value*) e cálculo matemático do polinômio `CRC16-CCITT` (`0x1021`, Init `0xFFFF`).
- **🔬 Termômetro de Legibilidade Óptica (Scannability Gauge):** Análise em tempo real baseada em WCAG 2.1 (luminância relativa, contraste no pior caso de gradientes e oclusão de logo central contra a capacidade da matriz Reed-Solomon `L`, `M`, `Q` ou `H`).
- **📷 Validador Óptico Computacional:** Decodificador nativo em tempo real (`html5-qrcode`) que decodifica o canvas gerado ou acessa a webcam para provar matematicamente a legibilidade antes da impressão.
- **📐 Exportação Gráfica Industrial:**
  - **Raster:** PNG e WebP em **1K (1024px)**, **2K (2048px)** e **4K (4096px)** com escala proporcional milimétrica.
  - **Vetor SVG Limpo:** Código SVG sem resíduos de DOM, pronto para edição no Figma e Adobe Illustrator.
  - **Área de Transferência:** Cópia instantânea da imagem PNG com 1 clique (Clipboard API).
  - **Folhas PDF de Impressão (A4):** Diagramação automática para Display/Placa de Balcão única ou Grade 3x4 (12 adesivos prontos para recorte).

---

## 🛠️ Suporte Completo a 6 Payloads Inteligentes

| Tipo de Payload | Funcionalidades Especiais | Padrão / Protocolo |
| :--- | :--- | :--- |
| **URL / Link** | Suporte a construtor de parâmetros de rastreamento de marketing (UTM). | `https://` RFC 3986 |
| **PIX (BRCode)** | Seleção de chave (CPF, CNPJ, Telefone E.164, E-mail, EVP), TxID, valor e CRC16. | Banco Central do Brasil / EMVCo |
| **Wi-Fi** | Redes WPA/WPA2, WEP ou Abertas, com suporte a rede oculta e teste de senha. | Protocolo `WIFI:S:...;` |
| **vCard 3.0** | Cartão de contato completo com nome, cargo, empresa, telefones, e-mail e endereço. | RFC 2426 (vCard 3.0) |
| **WhatsApp** | Link direto de conversa com DDI, DDD e mensagem automática pré-preenchida. | RFC 3986 / API WhatsApp |
| **Evento (iCal)** | Agendamento de compromissos com data/hora UTC, local e descrição detalhada. | RFC 5545 (iCalendar 2.0) |

---

## 🏛️ Arquitetura de Software

O código-fonte é estruturado em **Clean Architecture** e **Screaming Architecture**, separando regras matemáticas puras de componentes visuais:

```text
src/
├── core/                # Regras de Negócio Puras (Zero dependências de UI)
│   ├── algorithms/      # CRC16-CCITT, Luminância WCAG e Matriz de Escaneabilidade
│   └── builders/        # Compiladores de Payload (PIX, Wi-Fi, vCard, UTM, iCal)
├── modules/             # Camada de Apresentação e Módulos do Estúdio
│   ├── payload-builder/ # Formulários inteligentes com formatação e máscaras
│   ├── studio/          # Design Studio (geometrias, gradientes, olhos e logo)
│   ├── preview/         # Canvas reativo, Validador Óptico e Termômetro
│   ├── export/          # Motores gráficos (Canvas 4K, SVG limpo e jsPDF)
│   └── presets-history/ # Galeria de templates e histórico local (LocalStorage)
├── shared/              # Layout e componentes globais
└── store/               # Gerenciamento de Estado Reativo (Zustand com persistência)
```

---

## 💻 Como Rodar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- Gerenciador de pacotes `npm`, `pnpm` ou `yarn`

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/PedroBosa/QRCraft.git

# 2. Acesse a pasta do projeto
cd QRCraft

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em seu navegador: `http://localhost:5173`.

### Build de Produção

```bash
npm run build
```

Os artefatos estáticos otimizados serão compilados na pasta `dist/`.

---

## 🚀 Deploy Automatizado no GitHub Pages

O projeto inclui um pipeline de **CI/CD via GitHub Actions** configurado em [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Para ativar o deploy no seu repositório:
1. Vá em **Settings** > **Pages** no repositório do GitHub.
2. Em **Build and deployment** > **Source**, selecione **GitHub Actions**.
3. A cada `push` na branch `main`, o build será compilado e publicado automaticamente no link:
   👉 `https://pedrobosa.github.io/QRCraft/`

---

## 🎨 Design System & Estética

- **Superfícies:** Tons ultra-escuros com acabamento monolítico (`#09090B`, `#0D0D10`).
- **Linhas & Divisores:** Bordas sutis em `rgba(255, 255, 255, 0.06)`.
- **Acentos:** Índigo Primário (`#4F46E5`), Roxo Destaque (`#9D4EDD`), Ciano (`#22D3EE`) e Verde Suave (`#58DB91`).
- **Geometria:** Segmented controls com curvaturas concêntricas ($R_{inner} = R_{outer} - \text{padding}$).
- **Scrollbars:** Barras ultrafinas de 6px e 3px sem setas nativas cinzas do sistema operacional.

---

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.

<div align="center">
  Feito com dedicação por <a href="https://github.com/PedroBosa">Pedro Bosa</a>
</div>
