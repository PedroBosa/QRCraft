# Registro de Alterações (Changelog)

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato baseia-se em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- Proposta de testes automatizados com cobertura unitária para os geradores TLV de EMV-PIX e cálculo CRC16.
- Proposta de decodificação de imagens de arquivo local arrastadas para o validador óptico.

## [1.0.0] - 2026-11-09

### Adicionado
- Estúdio de engenharia e parametrização de QR Codes com execução 100% no cliente e arquitetura desacoplada (*Clean Architecture*).
- Implementação estrita do algoritmo CRC16-CCITT (polinômio `0x1021`, inicialização `0xFFFF`) para cálculo de checksum de integridade.
- Construtor de payload financeiro EMV BR Code / PIX compatível com as normas regulatórias do Banco Central do Brasil (BACEN), com estrutura TLV (*Tag-Length-Value*), suporte aos tipos de chave (CPF, CNPJ, telefone E.164, e-mail, EVP), TxID e valor nominal.
- Construtores inteligentes de payloads estruturados: URL com gerador de parâmetros UTM, credenciais Wi-Fi (WPA/WPA2/WEP), cartão de contato vCard 3.0 (RFC 2426), links diretos de WhatsApp e agendamento de eventos iCalendar 2.0 (RFC 5545).
- Motor de diagnóstico de escaneabilidade óptica (*Scannability Gauge*) com cálculo de luminância relativa e razão de contraste sob WCAG 2.1 no pior caso de gradientes, detecção de padrão invertido e verificação de oclusão de logo central contra a capacidade da matriz de correção de erro Reed-Solomon (níveis L, M, Q e H).
- Validador óptico computacional integrado via biblioteca `html5-qrcode` com leitura em tempo real via câmera ou renderização interna de canvas.
- Pipeline de exportação em múltiplos formatos: PNG e WebP rasterizados em resoluções 1K (1024px), 2K (2048px) e 4K (4096px), vetor limpo SVG encapsulado, cópia direta para a área de transferência (`ClipboardItem`) e diagramação em folhas PDF A4 via `jsPDF` (placa individual ou grade 3×4 com 12 etiquetas para impressão).
- Histórico local de projetos e predefinições de design mantidos via `localStorage`.
- Configuração de integração contínua (CI) e esteira de deploy no GitHub Pages.

[Não lançado]: https://github.com/PedroBosa/QRCraft/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/PedroBosa/QRCraft/releases/tag/v1.0.0
