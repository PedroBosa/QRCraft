import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CheckCircle2, XCircle, Zap, Upload, X, RefreshCw } from 'lucide-react';
import { useQrStore } from '../../../store/useQrStore';
import { compilePayload } from '../../../core/builders';

interface CameraValidatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CameraValidatorModal: React.FC<CameraValidatorModalProps> = ({ isOpen, onClose }) => {
  const payload = useQrStore((state) => state.payload);
  const compiledPayload = compilePayload(payload);

  const [activeTab, setActiveTab] = useState<'current' | 'camera' | 'upload'>('current');
  const [testResult, setTestResult] = useState<{
    success: boolean;
    decodedText?: string;
    elapsedMs?: number;
    error?: string;
  } | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraScannedData, setCameraScannedData] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parar câmera com segurança ao fechar modal ou mudar de aba
  const stopCamera = async () => {
    if (scannerRef.current && isCameraActive) {
      try {
        await scannerRef.current.stop();
      } catch {
        // Ignora erros de parada se já estiver interrompida
      } finally {
        setIsCameraActive(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  // Testar o QR Code renderizado no estúdio instantaneamente
  const testCurrentQR = async () => {
    setTestResult(null);
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      setTestResult({ success: false, error: 'Canvas do QR Code não encontrado.' });
      return;
    }

    const startTime = performance.now();

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'current-qr.png', { type: 'image/png' });

      const scanner = new Html5Qrcode('qr-temp-reader-hidden');
      const decodedText = await scanner.scanFile(file, true);
      const elapsed = Math.round(performance.now() - startTime);

      setTestResult({
        success: true,
        decodedText,
        elapsedMs: elapsed,
      });
      await scanner.clear();
    } catch {
      setTestResult({
        success: false,
        elapsedMs: Math.round(performance.now() - startTime),
        error: 'O decodificador óptico não conseguiu ler o código gerado. Verifique contraste ou tamanho da logo.',
      });
    }
  };

  // Iniciar scanner via Webcam
  const startCamera = async () => {
    setCameraScannedData(null);
    try {
      const scanner = new Html5Qrcode('qr-webcam-viewport');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 15, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setCameraScannedData(decodedText);
          stopCamera();
        },
        () => {
          // Frame não lido
        }
      );
      setIsCameraActive(true);
    } catch {
      alert('Não foi possível inicializar a câmera. Verifique as permissões de acesso.');
    }
  };

  // Escanear a partir de upload de imagem
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const scanner = new Html5Qrcode('qr-file-reader-hidden');
      const decoded = await scanner.scanFile(file, true);
      setCameraScannedData(decoded);
      await scanner.clear();
    } catch {
      alert('Nenhum código QR legível foi encontrado na imagem fornecida.');
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
      {/* Elementos ocultos para processamento offscreen */}
      <div id="qr-temp-reader-hidden" className="hidden" />
      <div id="qr-file-reader-hidden" className="hidden" />

      <div className="relative flex w-full max-w-lg max-h-[92vh] overflow-y-auto flex-col gap-4 sm:gap-6 rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-2xl custom-scrollbar">
        {/* Header do Modal */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary-hover">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Validador Óptico em Tempo Real</h3>
              <p className="text-xs text-zinc-400">Verificação computacional com motor nativo html5-qrcode.</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Abas em Segmented Control */}
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-zinc-950/80 p-1">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('current');
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[6px] py-2 text-xs font-medium transition-all border ${
              activeTab === 'current'
                ? 'border-white/[0.08] bg-zinc-800 text-white shadow-sm'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <Zap className="h-4 w-4 text-accent-cyan" strokeWidth={1.75} />
            <span>Testar QR Atual</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[6px] py-2 text-xs font-medium transition-all border ${
              activeTab === 'camera'
                ? 'border-white/[0.08] bg-zinc-800 text-white shadow-sm'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <Camera className="h-4 w-4 text-secondary-hover" strokeWidth={1.75} />
            <span>Webcam / Imagem Externa</span>
          </button>
        </div>

        {/* Conteúdo da Aba 1: Testar QR Atual */}
        {activeTab === 'current' && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-zinc-400 leading-relaxed">
              O teste passa a imagem rasterizada do canvas diretamente pelo algoritmo de decodificação óptica,
              comprovando se leitores físicos conseguirão ler o QR Code com as cores e logo atuais.
            </p>

            <button
              type="button"
              onClick={testCurrentQR}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-xs font-bold text-white shadow-lg shadow-primary/20 hover:opacity-95 transition-opacity"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Executar Diagnóstico Óptico Agora</span>
            </button>

            {testResult && (
              <div
                className={`flex flex-col gap-2 rounded-xl border p-4 text-xs ${
                  testResult.success
                    ? 'border-success/30 bg-success/10 text-zinc-200'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {testResult.success ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400" />
                    )}
                    <span className="font-bold">
                      {testResult.success ? 'Leitura 100% Bem-sucedida!' : 'Falha na Decodificação Óptica'}
                    </span>
                  </div>
                  {testResult.elapsedMs !== undefined && (
                    <span className="font-mono text-[10px] text-zinc-400">
                      Tempo: {testResult.elapsedMs}ms
                    </span>
                  )}
                </div>

                {testResult.success && (
                  <div className="mt-2 flex flex-col gap-1 rounded-lg bg-zinc-950/70 p-2.5 font-mono text-[11px] break-all border border-zinc-800">
                    <span className="text-[10px] uppercase text-zinc-500">Conteúdo Lido:</span>
                    <span className="text-success">{testResult.decodedText}</span>
                  </div>
                )}

                {testResult.error && <p className="mt-1 text-xs text-rose-300">{testResult.error}</p>}
              </div>
            )}
          </div>
        )}

        {/* Conteúdo da Aba 2: Câmera / Upload */}
        {activeTab === 'camera' && (
          <div className="flex flex-col gap-4">
            <div
              id="qr-webcam-viewport"
              className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-center min-h-[220px]"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-2">
              {!isCameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/20 py-2.5 text-xs font-semibold text-white hover:bg-primary/30 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <span>Ligar Webcam</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/20 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/30 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Desligar Câmera</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Upload de Foto</span>
              </button>
            </div>

            {cameraScannedData && (
              <div className="flex flex-col gap-1.5 rounded-xl border border-success/30 bg-success/10 p-3.5 text-xs">
                <div className="flex items-center gap-2 text-success font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Código Lido com Sucesso:</span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-zinc-200 break-all bg-zinc-950/70 p-2 rounded-lg border border-zinc-800">
                  {cameraScannedData}
                </p>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                  <span>
                    Bate com o estúdio?{' '}
                    <strong className={cameraScannedData === compiledPayload ? 'text-success' : 'text-rose-400'}>
                      {cameraScannedData === compiledPayload ? 'SIM' : 'NÃO'}
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
