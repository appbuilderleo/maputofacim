// ── FACIM 2026 Constants ──────────────────────────────────────

export const APP_NAME = 'A Caminho da FACIM';
export const APP_DESCRIPTION = 'Plataforma de Gestão e Promoção da Participação da Província de Maputo na 61ª Edição da FACIM 2026';
export const FACIM_EDITION = '61ª Edição';
export const FACIM_YEAR = 2026;

// FACIM event date
export const FACIM_DATE = new Date(process.env.NEXT_PUBLIC_FACIM_DATE || '2026-08-25T08:00:00+02:00');

// Districts of Maputo Province
export const DISTRITOS = [
  'Matola',
  'Boane',
  'Marracuene',
  'Matutuíne',
  'Moamba',
  'Namaacha',
  'Manhiça',
  'Magude',
] as const;

// Business sectors
export const SECTORES_ACTIVIDADE = [
  'Agro-indústria',
  'Agricultura e Pecuária',
  'Comércio Geral',
  'Comércio Internacional',
  'Construção Civil',
  'Educação e Formação',
  'Energia e Recursos Naturais',
  'Indústria Alimentar',
  'Indústria Transformadora',
  'Pescas e Aquicultura',
  'Saúde e Farmácia',
  'Serviços Financeiros',
  'Tecnologia e Inovação',
  'Telecomunicações',
  'Transportes e Logística',
  'Turismo e Hotelaria',
  'Outro',
] as const;

// Sponsorship packages
export const PACOTES_PATROCINIO = [
  {
    nome: 'Platinum',
    nivel: 'Máximo',
    icon: '💎',
    color: '#534AB7',
    bgClass: 'pkg-platinum',
    descricao: 'Visibilidade máxima',
  },
  {
    nome: 'Gold',
    nivel: 'Premium',
    icon: '🥇',
    color: '#7A4A00',
    bgClass: 'pkg-gold',
    descricao: 'Exposição premium',
  },
  {
    nome: 'Silver',
    nivel: 'Intermédio',
    icon: '🥈',
    color: '#5F5E5A',
    bgClass: 'pkg-silver',
    descricao: 'Presença sólida',
  },
  {
    nome: 'Bronze',
    nivel: 'Base',
    icon: '🥉',
    color: '#C87840',
    bgClass: 'pkg-bronze',
    descricao: 'Participação base',
  },
] as const;

// Stand types
export const TIPOS_STAND = [
  'Standard (3x3m)',
  'Standard (3x4m)',
  'Premium (4x4m)',
  'Premium (4x6m)',
  'Espaço Aberto',
  'Personalizado',
] as const;

// Navigation links
export const NAV_LINKS = [
  { label: 'Início', href: '/' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Cronograma', href: '/cronograma' },
  { label: 'Notícias', href: '/noticias' },
  { label: 'Patrocínios', href: '/patrocinadores' },
  { label: 'Galeria', href: '/galeria' },
  { label: 'Contactos', href: '/contactos' },
] as const;

// Status labels mapping
export const ESTADO_CANDIDATURA_LABELS: Record<string, { label: string; badgeClass: string }> = {
  RASCUNHO: { label: 'Rascunho', badgeClass: 'badge-silver' },
  PENDENTE: { label: 'Pendente', badgeClass: 'badge-orange' },
  EM_ANALISE: { label: 'Em Análise', badgeClass: 'badge-blue' },
  APROVADA: { label: 'Aprovada', badgeClass: 'badge-teal' },
  REJEITADA: { label: 'Rejeitada', badgeClass: 'badge-bronze' },
  CANCELADA: { label: 'Cancelada', badgeClass: 'badge-silver' },
};

export const ESTADO_PATROCINIO_LABELS: Record<string, { label: string; badgeClass: string }> = {
  INTERESSE: { label: 'Interesse', badgeClass: 'badge-orange' },
  EM_ANALISE: { label: 'Em Análise', badgeClass: 'badge-blue' },
  APROVADO: { label: 'Aprovado', badgeClass: 'badge-teal' },
  REJEITADO: { label: 'Rejeitado', badgeClass: 'badge-bronze' },
  CONFIRMADO: { label: 'Confirmado', badgeClass: 'badge-teal' },
};

// Document types
export const TIPOS_DOCUMENTO = [
  { value: 'alvara', label: 'Alvará Comercial' },
  { value: 'nuit', label: 'Certificado NUIT' },
  { value: 'comprovativo', label: 'Comprovativo de Pagamento' },
  { value: 'certificado', label: 'Certificado de Actividade Comercial' },
  { value: 'outro', label: 'Outro Documento' },
] as const;
