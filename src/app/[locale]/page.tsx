'use client';

import { useState } from 'react';

// === Base de Dados dos 9 Sectores Estratégicos (Fonte: PROVÍNCIA DE MAPUTO.md) ===
const SECTORS_DATA: Record<string, {
  icon: string;
  title: string;
  badge: string;
  potential: string;
  activities: string[];
  locations: string;
}> = {
  agricultura: {
    icon: '🌾',
    title: 'Agricultura Comercial',
    badge: 'Segurança Alimentar & Abastecimento',
    potential: 'A agricultura constitui uma das principais bases produtivas da Província de Maputo, aproveitando férteis bacias hidrográficas e ligação contínua a mercados consumidores de alta densidade.',
    activities: [
      'Produção comercial de hortícolas de folha e fruto (tomate, repolho, pimentos, cebola)',
      'Fruticultura tropical e citrinos para consumo e exportação',
      'Cereais e leguminosas em regime intensivo',
      'Sistemas de irrigação gota-a-gota e agricultura de precisão',
      'Produção e distribuição de sementes certificadas e insumos agrícolas',
    ],
    locations: 'Distritos da Manhiça, Marracuene, Boane e Moamba.',
  },
  agroindustria: {
    icon: '🏭',
    title: 'Agroindústria & Transformação',
    badge: 'Agregação de Valor',
    potential: 'Transformação da produção primária local em produtos de valor acrescentado, substituindo importações no mercado nacional e exportando para a África Austral.',
    activities: [
      'Processamento e polpas de fruta (manga, citrinos, banana)',
      'Moagem e refinação de cereais e farinhas compostas',
      'Unidades industriais de conservas e acondicionamento asséptico',
      'Cadeias de frio e entrepostos de estocagem frigorífica',
      'Indústria de embalagem e rotulagem moderna',
    ],
    locations: 'Boane, Manhiça e Parque Industrial de Beluluane.',
  },
  industria: {
    icon: '🏗️',
    title: 'Indústria & Transformação',
    badge: 'Polo Industrial Continental',
    potential: 'A Província de Maputo concentra a maior base fabril do país, usufruindo de energia fiável, gás natural canalizado e incentivos competitivos de Zonas Francas Industriais.',
    activities: [
      'Indústria alimentar e bebidas de classe internacional',
      'Fabrico de materiais de construção (cimento, blocos, estruturas metálicas)',
      'Indústria ligeira e montagem de componentes mecânicos e elétricos',
      'Produção de embalagens plásticas, metálicas e papelão',
      'Reciclagem e economia circular integrada',
    ],
    locations: 'Parque Industrial de Beluluane, Matola e Zona Económica Especial de Moamba.',
  },
  logistica: {
    icon: '🚛',
    title: 'Logística, Armazenagem e Distribuição',
    badge: 'Plataforma Regional SADC',
    potential: 'Inserida de forma vital no Corredor de Desenvolvimento Sul, com portos de águas profundas, autoestradas pedagiadas e três linhas ferroviárias activas.',
    activities: [
      'Centros de distribuição logística e terminais de carga seca',
      'Armazenagem especializada e parques de contentores',
      'Cadeias de frio integradas e transporte frigorífico',
      'Operações de trânsito aduaneiro para a África do Sul e Eswatini',
      'Serviços de rastreabilidade digital e transitários de carga',
    ],
    locations: 'Matola (Área Portuária), Boane, Moamba e Ressano Garcia.',
  },
  pesca: {
    icon: '🐟',
    title: 'Pesca & Aquacultura',
    badge: 'Economia Azul & Exportação',
    potential: 'A extensa costa marítima e ricas águas interiores criam um ambiente favorável ao desenvolvimento de cadeias aquícolas sustentáveis de alto rendimento.',
    activities: [
      'Aquacultura marinha e estuarina de camarão e bivalves',
      'Piscicultura continental intensiva (tilápia e bagre)',
      'Processamento, corte e embalagem de pescado',
      'Instalação de fábricas de gelo e terminais de refrigeração',
      'Comercialização e exportação com certificação sanitária',
    ],
    locations: 'Matutuíne, Marracuene e Baía de Maputo.',
  },
  pecuaria: {
    icon: '🐄',
    title: 'Pecuária & Avicultura',
    badge: 'Proteína Animal',
    potential: 'A procura crescente por carne, ovos e laticínios na cintura metropolitana assegura mercado garantido para projectos de criação e abate regulado.',
    activities: [
      'Criação e engorda de gado bovino e caprino',
      'Avicultura de corte e produção de ovos industriais',
      'Bacia leiteira e pasteurização de leite e iogurtes',
      'Fábricas de rações balanceadas e suplementos',
      'Matadouros modernos com certificado Halal e inspeção sanitária',
    ],
    locations: 'Magude, Moamba, Boane e Manhiça.',
  },
  turismo: {
    icon: '🏖️',
    title: 'Turismo & Ecoturismo',
    badge: 'Património & Biodiversidade',
    potential: 'Diversidade paisagística deslumbrante, costa com recifes e o prestigiado Parque Nacional de Maputo tornam a Província um pólo turístico de renome mundial.',
    activities: [
      'Resorts hoteleiros de praia e ecoturismo de luxo',
      'Lodges de safari no Parque Nacional de Maputo',
      'Turismo náutico, mergulho e observação marinha na Ponta do Ouro',
      'Complexos para congressos, conferências e eventos corporativos',
      'Restaurantes temáticos e rotas culturais',
    ],
    locations: 'Matutuíne (Ponta do Ouro, Santa Maria), Marracuene e Namaacha.',
  },
  energia: {
    icon: '⚡',
    title: 'Energia & Renováveis',
    badge: 'Transição Energética',
    potential: 'O crescimento industrial exige soluções energéticas eficientes, solares e sustentáveis, aproveitando a excelente irradiação solar da província.',
    activities: [
      'Centrais solares fotovoltaicas em escala de utilidade (IPP)',
      'Sistemas solares distribuídos para parques industriais e agropecuária',
      'Soluções de armazenamento de energia em baterias (BESS)',
      'Infraestruturas elétricas para zonas rurais e industriais',
      'Projetos de biogás a partir de resíduos agrícolas e pecuários',
    ],
    locations: 'Moamba, Boane e Manhiça.',
  },
  servicos: {
    icon: '💼',
    title: 'Comércio & Serviços Especializados',
    badge: 'Dinamização Económica',
    potential: 'A concentração populacional e institucional gera contínua oportunidade para empresas prestadoras de serviços corporativos, tecnológicos e financeiros.',
    activities: [
      'Serviços empresariais de contabilidade, auditoria e advocacia',
      'Tecnologias de informação e soluções digitais para negócios',
      'Serviços bancários, microcrédito e seguros para investimentos',
      'Educação técnica profissionalizante vocacionada para a indústria',
      'Serviços médicos, saúde ocupacional e clínicas privadas',
    ],
    locations: 'Cidade da Matola e sedes distritais.',
  },
};

// Oportunidades estruturadas
const OPPORTUNITIES = [
  {
    id: 1,
    sectorKey: 'agricultura',
    sectorName: 'Agricultura',
    badgeClass: 'bg-mp-greenLight text-mp-greenDark',
    location: 'Manhiça',
    title: 'Pólo de Produção Hortícola & Irrigação Comercial',
    desc: 'Instalação de unidade integrada de cultivo protegido e processamento de vegetais no Vale do Incomáti.',
    type: 'Greenfield / Produção',
    scale: 'grande',
    scaleLabel: 'Grande Escala',
  },
  {
    id: 2,
    sectorKey: 'industria',
    sectorName: 'Indústria',
    badgeClass: 'bg-mp-blueLight text-mp-blue',
    location: 'Boane',
    title: 'Fábrica de Transformação e Embalagem',
    desc: 'Produção de materiais de embalagem biodegradáveis e componentes ligeiros para abastecer fábricas da região.',
    type: 'Manufatura Industrial',
    scale: 'grande',
    scaleLabel: 'Grande Escala',
  },
  {
    id: 3,
    sectorKey: 'logistica',
    sectorName: 'Logística',
    badgeClass: 'bg-mp-blueDeep text-white',
    location: 'Matola',
    title: 'Centro Logístico & Armazéns de Frio',
    desc: 'Complexo logístico para consolidação de carga perecível e frigorífica conectada ao Porto da Matola e à EN4.',
    type: 'Hub Logístico Multimodal',
    scale: 'estrategica',
    scaleLabel: 'Projecto Estratégico',
  },
  {
    id: 4,
    sectorKey: 'turismo',
    sectorName: 'Turismo',
    badgeClass: 'bg-mp-greenDark text-white',
    location: 'Matutuíne',
    title: 'Eco-Resort de Luxo no Parque Nacional',
    desc: 'Concessão e instalação de empreendimento hoteleiro sustentável com foco em safaris terrestres e marítimos.',
    type: 'Hospitalidade Ecológica',
    scale: 'grande',
    scaleLabel: 'Grande Escala',
  },
  {
    id: 5,
    sectorKey: 'energia',
    sectorName: 'Energia',
    badgeClass: 'bg-orange-100 text-mp-orange',
    location: 'Moamba',
    title: 'Parque Solar Fotovoltaico & Baterias',
    desc: 'Geração de energia limpa com conexão direta à rede de alta tensão para abastecer a ZEE de Moamba.',
    type: 'IPP / Energia Solar',
    scale: 'estrategica',
    scaleLabel: 'Projecto Estratégico',
  },
  {
    id: 6,
    sectorKey: 'pesca',
    sectorName: 'Pesca',
    badgeClass: 'bg-teal-100 text-teal-800',
    location: 'Marracuene',
    title: 'Unidade de Piscicultura em Recirculação',
    desc: 'Criação intensiva de tilápia e bagre para suprir o mercado metropolitano e hipermercados.',
    type: 'Aquacultura Comercial',
    scale: 'media',
    scaleLabel: 'Média Dimensão',
  },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadPreselectedSector, setLeadPreselectedSector] = useState('Geral');
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtros de Oportunidades
  const [filterSector, setFilterSector] = useState('todos');
  const [filterLocation, setFilterLocation] = useState('todos');
  const [filterScale, setFilterScale] = useState('todos');

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openSector = (key: string) => {
    setSelectedSector(key);
  };

  const openLead = (sector: string) => {
    setLeadPreselectedSector(sector);
    setLeadSuccess(false);
    setLeadModalOpen(true);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setLeadSuccess(true);
      setTimeout(() => {
        setLeadModalOpen(false);
      }, 3500);
    }, 1000);
  };

  const filteredOpportunities = OPPORTUNITIES.filter((opp) => {
    const matchSector = filterSector === 'todos' || opp.sectorKey === filterSector;
    const matchLocation = filterLocation === 'todos' || opp.location === filterLocation;
    const matchScale = filterScale === 'todos' || opp.scale === filterScale;
    return matchSector && matchLocation && matchScale;
  });

  const activeSectorData = selectedSector ? SECTORS_DATA[selectedSector] : null;

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-mp-blue selection:text-white">

      {/* =========================================================
           1. TOP BAR GOVERNAMENTAL & CONTACTOS (Limpo)
      ========================================================= */}
      <aside aria-label="Avisos Institucionais" className="bg-mp-blueDeep text-white text-[12px] py-2.5 border-b border-white/10 hidden md:block z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center">
          <div className="flex items-center gap-6 text-white/90 font-medium">
            <button onClick={() => scrollTo('bau')} className="hover:text-mp-yellow transition-colors flex items-center gap-2">
              <i className="fa-solid fa-building-circle-check text-mp-green text-sm"></i> Balcão de Atendimento Único (BAÚ)
            </button>
            <span className="text-white/20">|</span>
            <a href="mailto:investimentos@dpic-maputo.gov.mz" className="hover:text-mp-yellow transition-colors flex items-center gap-2">
              <i className="fa-regular fa-envelope text-mp-yellow text-sm"></i> investimentos@dpic-maputo.gov.mz
            </a>
          </div>
        </div>
      </aside>

      {/* =========================================================
           NAVIGATION BAR: Logotipo Oficial da Província de Maputo
      ========================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logotipo Oficial da Província de Maputo (Sem elementos redundantes) */}
            <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => scrollTo('hero')}>
              <img
                src="/uploads/logo.png"
                alt="Logotipo Oficial da Província de Maputo"
                className="h-12 sm:h-14 w-auto object-contain hover:opacity-95 transition-opacity"
              />
            </div>

            {/* Menu Desktop (Visível em ecrãs grandes xl) */}
            <nav className="hidden xl:flex items-center gap-1 font-semibold text-[13px] text-slate-700">
              <button onClick={() => scrollTo('hero')} className="px-3 py-2 rounded-lg hover:text-mp-blue hover:bg-mp-blueLight transition-all font-bold text-mp-blue">
                Início
              </button>
              <button onClick={() => scrollTo('porque-maputo')} className="px-3 py-2 rounded-lg hover:text-mp-blue hover:bg-mp-blueLight transition-all">
                Porquê Maputo?
              </button>
              <button onClick={() => scrollTo('corredores')} className="px-3 py-2 rounded-lg hover:text-mp-blue hover:bg-mp-blueLight transition-all">
                Localização & Corredores
              </button>
              <button onClick={() => scrollTo('sectores')} className="px-3 py-2 rounded-lg hover:text-mp-blue hover:bg-mp-blueLight transition-all">
                Sectores
              </button>
              <button onClick={() => scrollTo('zonas')} className="px-3 py-2 rounded-lg hover:text-mp-blue hover:bg-mp-blueLight transition-all">
                Zonas Industriais
              </button>
              <button onClick={() => scrollTo('oportunidades')} className="px-3 py-2 rounded-lg hover:text-mp-blue hover:bg-mp-blueLight transition-all">
                Oportunidades
              </button>
              <button onClick={() => scrollTo('bau')} className="px-3 py-2 rounded-lg hover:text-mp-blue hover:bg-mp-blueLight transition-all">
                BAÚ / Apoio
              </button>
              <button onClick={() => scrollTo('contactos')} className="px-3 py-2 rounded-lg hover:text-mp-blue hover:bg-mp-blueLight transition-all">
                Contactos
              </button>
            </nav>

            {/* CTA Desktop */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => openLead('Portal Geral')}
                className="inline-flex items-center gap-2 bg-mp-blue hover:bg-mp-blueHover text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
              >
                <i className="fa-solid fa-briefcase text-mp-yellow"></i> Quero Investir
              </button>
            </div>

            {/* Toggle Mobile & Tablet */}
            <div className="flex items-center xl:hidden gap-2">
              <button onClick={() => openLead('Mobile')} className="sm:hidden bg-mp-blue text-white px-3 py-1.5 rounded-lg font-bold text-xs">
                Investir
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 text-xl focus:outline-none"
                aria-label="Abrir Menu"
              >
                <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 xl:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden fixed top-20 right-0 w-full sm:w-80 bg-white border-b border-l border-slate-200 px-6 pt-4 pb-8 space-y-3 shadow-2xl z-50 max-h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar animate-fade-in">
            <button onClick={() => scrollTo('hero')} className="block w-full text-left px-4 py-2.5 rounded-lg font-bold text-sm text-mp-blue hover:bg-mp-blueLight">
              Início
            </button>
            <button onClick={() => scrollTo('porque-maputo')} className="block w-full text-left px-4 py-2.5 rounded-lg font-semibold text-sm text-slate-700 hover:bg-slate-50">
              Porquê Maputo?
            </button>
            <button onClick={() => scrollTo('corredores')} className="block w-full text-left px-4 py-2.5 rounded-lg font-semibold text-sm text-slate-700 hover:bg-slate-50">
              Localização & Corredores
            </button>
            <button onClick={() => scrollTo('sectores')} className="block w-full text-left px-4 py-2.5 rounded-lg font-semibold text-sm text-slate-700 hover:bg-slate-50">
              Sectores Estratégicos
            </button>
            <button onClick={() => scrollTo('zonas')} className="block w-full text-left px-4 py-2.5 rounded-lg font-semibold text-sm text-slate-700 hover:bg-slate-50">
              Zonas Industriais & ZEE
            </button>
            <button onClick={() => scrollTo('oportunidades')} className="block w-full text-left px-4 py-2.5 rounded-lg font-semibold text-sm text-slate-700 hover:bg-slate-50">
              Catálogo de Oportunidades
            </button>
            <button onClick={() => scrollTo('bau')} className="block w-full text-left px-4 py-2.5 rounded-lg font-semibold text-sm text-slate-700 hover:bg-slate-50">
              Balcão Único (BAÚ)
            </button>
            <button onClick={() => scrollTo('contactos')} className="block w-full text-left px-4 py-2.5 rounded-lg font-semibold text-sm text-slate-700 hover:bg-slate-50">
              Contactos & Localização
            </button>
            <div className="pt-2">
              <button
                onClick={() => openLead('Mobile Menu')}
                className="w-full bg-mp-blue text-white py-3 rounded-xl font-bold text-center text-sm shadow-md"
              >
                <i className="fa-solid fa-paper-plane mr-2 text-mp-yellow"></i> Contactar Equipa de Investimento
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================
           2. HERO / ECRÃ INICIAL
      ========================================================= */}
      <section id="hero" className="relative min-h-[86vh] lg:min-h-[92vh] flex items-center justify-center bg-mp-blueDeep overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-35 filter saturate-120">
            <source src="/hero/1.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-mp-blueDeep/95 via-mp-blueDeep/85 to-mp-blue/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-mp-blueDeep via-transparent to-black/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex flex-wrap items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-bold text-white shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-mp-green animate-ping"></span>
              <span className="text-mp-yellow uppercase tracking-widest text-[11px]">Portal de Investimento</span>
              <span className="text-white/40">•</span>
              <span>Província de Maputo, Moçambique</span>
              <span className="text-white/40">•</span>
              <span className="bg-mp-orange/90 text-white text-[10px] px-2 py-0.5 rounded-full font-black">FACIM 2026</span>
            </div>

            <div className="space-y-2">
              <span className="block text-mp-yellow font-extrabold text-sm md:text-base tracking-[0.25em] uppercase">
                República de Moçambique
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white leading-[1.08]">
                PROVÍNCIA DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-mp-yellow via-white to-mp-green">MAPUTO</span>
              </h1>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white/95 font-display">
                O lugar certo para investir, viver e ser.
              </p>
            </div>

            <p className="text-base sm:text-xl text-white/85 max-w-3xl leading-relaxed font-normal">
              Uma plataforma estratégica para negócios, produção, inovação e acesso privilegiado aos mercados de Moçambique e da África Austral.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => scrollTo('oportunidades')}
                className="bg-mp-yellow hover:bg-mp-yellowDark text-mp-blueDeep font-black px-8 py-4 rounded-2xl text-sm sm:text-base uppercase tracking-wider shadow-xl transition-all flex items-center gap-3 transform hover:-translate-y-0.5"
              >
                <i className="fa-solid fa-arrow-trend-up"></i> Explorar Oportunidades
              </button>
              <button
                onClick={() => scrollTo('porque-maputo')}
                className="bg-white/15 hover:bg-white/25 text-white border-2 border-white/30 backdrop-blur-md font-bold px-7 py-4 rounded-2xl text-sm sm:text-base uppercase tracking-wider transition-all flex items-center gap-2.5"
              >
                <i className="fa-solid fa-circle-question text-mp-yellow"></i> Porquê Investir em Maputo?
              </button>
            </div>

            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-mp-blue/30 border border-mp-blue/40 flex items-center justify-center text-mp-yellow text-lg font-black">
                  8
                </div>
                <div className="text-xs">
                  <span className="font-black text-white block">Distritos</span>
                  <span className="text-white/70">Pólos de produção</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-mp-green/30 border border-mp-green/40 flex items-center justify-center text-mp-green text-lg font-black">
                  <i className="fa-solid fa-route"></i>
                </div>
                <div className="text-xs">
                  <span className="font-black text-white block">Corredor Sul</span>
                  <span className="text-white/70">Ligação regional</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-mp-yellow/30 border border-mp-yellow/40 flex items-center justify-center text-mp-yellow text-lg font-black">
                  <i className="fa-solid fa-industry"></i>
                </div>
                <div className="text-xs">
                  <span className="font-black text-white block">Beluluane & ZEE</span>
                  <span className="text-white/70">Parques modernos</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-mp-orange/30 border border-mp-orange/40 flex items-center justify-center text-white text-lg font-black">
                  100%
                </div>
                <div className="text-xs">
                  <span className="font-black text-white block">Apoio BAÚ</span>
                  <span className="text-white/70">Facilitação ágil</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
           3. PORQUÊ INVESTIR NA PROVÍNCIA DE MAPUTO? (Porquê Maputo?)
      ========================================================= */}
      <section id="porque-maputo" className="py-20 bg-mp-surface scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mp-blueLight text-mp-blue text-xs font-black uppercase tracking-widest mb-3">
              <i className="fa-solid fa-shield-halved"></i> Vantagens Competitivas
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-900 leading-tight">
              Porquê <span className="text-mp-blue">Maputo?</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
              A Província de Maputo reúne condições únicas que a transformam no epicentro económico e no destino de investimento mais dinâmico de Moçambique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 group hover:-translate-y-1.5 flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-mp-blueLight flex items-center justify-center text-mp-blue text-2xl mb-6 shadow-sm">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-mp-blue">Pilar 01</span>
              <h3 className="text-xl font-black text-slate-900 mt-1 mb-3 font-display">Localização Estratégica</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                Posição privilegiada no extremo sul de Moçambique, com acesso imediato e facilitado aos maiores mercados e centros industriais da África Austral: <strong>África do Sul e Reino de Eswatini</strong>.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 group hover:-translate-y-1.5 flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-mp-greenLight flex items-center justify-center text-mp-green text-2xl mb-6 shadow-sm">
                <i className="fa-solid fa-network-wired"></i>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-mp-green">Pilar 02</span>
              <h3 className="text-xl font-black text-slate-900 mt-1 mb-3 font-display">Conectividade e Logística</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                Integração no <strong>Corredor de Desenvolvimento Sul</strong>, ligando rodovias de classe internacional (EN4, Ponte Maputo-Katembe), rede ferroviária CFM e terminais portuários de águas profundas.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 group hover:-translate-y-1.5 flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-mp-yellowLight flex items-center justify-center text-mp-yellowDark text-2xl mb-6 shadow-sm">
                <i className="fa-solid fa-industry"></i>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-mp-yellowDark">Pilar 03</span>
              <h3 className="text-xl font-black text-slate-900 mt-1 mb-3 font-display">Base Industrial Robusta</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                Presença de importantes parques fabris e zonas industriais estruturadas, com destaque internacional para o <strong>Parque Industrial de Beluluane</strong> e a Zona Franca Industrial.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 group hover:-translate-y-1.5 flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-mp-greenLight flex items-center justify-center text-mp-greenDark text-2xl mb-6 shadow-sm">
                <i className="fa-solid fa-seedling"></i>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-mp-greenDark">Pilar 04</span>
              <h3 className="text-xl font-black text-slate-900 mt-1 mb-3 font-display">Recursos Naturais & Terras</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                Extensas áreas com elevada aptidão agropecuária, abundantes bacias hidrográficas (Incomáti, Umbelúzi, Maputo), riqueza aquícola, costa marítima estratégica e activos ecoturísticos incomparáveis.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 group hover:-translate-y-1.5 flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-mp-blueLight flex items-center justify-center text-mp-blueDark text-2xl mb-6 shadow-sm">
                <i className="fa-solid fa-users"></i>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-mp-blueDark">Pilar 05</span>
              <h3 className="text-xl font-black text-slate-900 mt-1 mb-3 font-display">Mercado em Expansão & Mão-de-Obra</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                Concentração populacional, institucional e empresarial gerando procura contínua por bens e serviços, com disponibilidade de força de trabalho jovem e com capacidade de capacitação rápida.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 group hover:-translate-y-1.5 flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-mp-orange text-2xl mb-6 shadow-sm">
                <i className="fa-solid fa-handshake-angle"></i>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-mp-orange">Pilar 06</span>
              <h3 className="text-xl font-black text-slate-900 mt-1 mb-3 font-display">Ambiente Favorável ao Investimento</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                Mecanismos consolidados de facilitação através do <strong>Balcão de Atendimento Único (BAÚ)</strong>, incentivos tributários, apoio institucional contínuo e simplificação de processos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
           4. MAPA E POSICIONAMENTO GEOESTRATÉGICO
      ========================================================= */}
      <section id="corredores" className="py-20 bg-mp-blueDeep text-white relative overflow-hidden scroll-mt-24">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mp-yellow text-mp-blueDeep text-xs font-black uppercase tracking-wider">
                <i className="fa-solid fa-compass"></i> Corredor de Desenvolvimento Sul
              </div>
              <h2 className="text-3xl sm:text-5xl font-black font-display leading-tight">
                Uma localização que <span className="text-mp-yellow">conecta mercados</span>
              </h2>
              <p className="text-lg text-white/90 leading-relaxed font-normal">
                <strong>Invista em Maputo e esteja estrategicamente posicionado para servir Moçambique e alcançar os mercados da África Austral.</strong>
              </p>
              <p className="text-sm text-white/75 leading-relaxed">
                Localizada no extremo sul do país, a Província de Maputo opera como a principal plataforma multimodal de comércio e transporte da região SADC, articulando portos marítimos, rodovias de trânsito rápido e eixos ferroviários directos com Joanesburgo, Pretória, Mbabane e os grandes centros produtivos da África Austral.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
                  <span className="text-xs text-mp-yellow font-bold uppercase tracking-wider block">🇲🇿 Mercado Nacional</span>
                  <span className="text-lg font-black block">Moçambique</span>
                  <span className="text-xs text-white/70">Acesso a todo o território</span>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
                  <span className="text-xs text-mp-green font-bold uppercase tracking-wider block">🇿🇦 Maior Economia</span>
                  <span className="text-lg font-black block">África do Sul</span>
                  <span className="text-xs text-white/70">Corredor EN4 / Joanesburgo</span>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
                  <span className="text-xs text-mp-yellow font-bold uppercase tracking-wider block">🇸🇿 Conexão Fronteiriça</span>
                  <span className="text-lg font-black block">Reino de Eswatini</span>
                  <span className="text-xs text-white/70">Fronteira Namaacha e Goba</span>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
                  <span className="text-xs text-mp-orange font-bold uppercase tracking-wider block">🌍 Bloco Regional</span>
                  <span className="text-lg font-black block">África Austral</span>
                  <span className="text-xs text-white/70">Mercado SADC Integrado</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/15 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div>
                    <h3 className="text-lg font-black text-white font-display">Rotas Estratégicas do Corredor Sul</h3>
                    <p className="text-xs text-white/60">Posicionamento Logístico Multimodal</p>
                  </div>
                  <span className="text-xs bg-mp-green/20 text-mp-green border border-mp-green/30 px-3 py-1 rounded-full font-bold">Operação Contínua</span>
                </div>

                <svg viewBox="0 0 500 360" className="w-full h-auto drop-shadow-lg">
                  <line x1="250" y1="180" x2="90" y2="90" stroke="#4382C3" strokeWidth="3" strokeDasharray="6,6" />
                  <line x1="250" y1="180" x2="80" y2="250" stroke="#45B48E" strokeWidth="3" strokeDasharray="6,6" />
                  <line x1="250" y1="180" x2="420" y2="80" stroke="#FCC24F" strokeWidth="3" strokeDasharray="6,6" />
                  <line x1="250" y1="180" x2="400" y2="280" stroke="#EF5A24" strokeWidth="3" strokeDasharray="6,6" />

                  <circle cx="250" cy="180" r="48" fill="#0B2545" stroke="#4382C3" strokeWidth="4" />
                  <text x="250" y="174" textAnchor="middle" fill="#FCC24F" fontSize="11" fontWeight="900">HUB MAPUTO</text>
                  <text x="250" y="190" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="700">PORTO & INDÚSTRIA</text>
                  <text x="250" y="202" textAnchor="middle" fill="#A5F3FC" fontSize="8">Matola / Boane</text>

                  <circle cx="90" cy="90" r="32" fill="#1E293B" stroke="#4382C3" strokeWidth="2.5" />
                  <text x="90" y="86" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="800">ÁFRICA DO SUL</text>
                  <text x="90" y="99" textAnchor="middle" fill="#93C5FD" fontSize="8">Gauteng · N4</text>

                  <circle cx="80" cy="250" r="30" fill="#1E293B" stroke="#45B48E" strokeWidth="2.5" />
                  <text x="80" y="246" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="800">ESWATINI</text>
                  <text x="80" y="259" textAnchor="middle" fill="#86EFAC" fontSize="8">Goba · Namaacha</text>

                  <circle cx="420" cy="80" r="32" fill="#1E293B" stroke="#FCC24F" strokeWidth="2.5" />
                  <text x="420" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="800">MOÇAMBIQUE</text>
                  <text x="420" y="89" textAnchor="middle" fill="#FDE68A" fontSize="8">Norte & Centro · EN1</text>

                  <circle cx="400" cy="280" r="34" fill="#1E293B" stroke="#EF5A24" strokeWidth="2.5" />
                  <text x="400" y="275" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="800">OCEANO ÍNDICO</text>
                  <text x="400" y="288" textAnchor="middle" fill="#FCA5A5" fontSize="8">Rotas Globais</text>
                </svg>

                <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-ship text-mp-yellow text-xl"></i>
                    <div className="text-xs">
                      <span className="font-bold text-white block">Porto de Maputo & Matola</span>
                      <span className="text-white/70">+30M toneladas movimentadas anualmente</span>
                    </div>
                  </div>
                  <button onClick={() => openLead('Logística e Corredores')} className="text-xs bg-mp-blue px-3 py-1.5 rounded-lg text-white font-bold hover:bg-mp-blueHover">
                    Saber mais
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
           5. SECTORES ESTRATÉGICOS (9 Grandes Sectores)
      ========================================================= */}
      <section id="sectores" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mp-greenLight text-mp-greenDark text-xs font-black uppercase tracking-widest mb-3">
              <i className="fa-solid fa-chart-pie"></i> Motores de Crescimento
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-900 leading-tight">
              Sectores <span className="text-mp-green">Estratégicos</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
              Conheça as oportunidades estruturadas em 9 sectores capazes de gerar valor acrescentado, empregos e integração regional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(SECTORS_DATA).map(([key, sector]) => (
              <div key={key} className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col bg-white">
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{sector.icon}</span>
                    <span className="text-[10px] font-bold text-mp-blue bg-mp-blueLight px-3 py-1 rounded-full uppercase">
                      {sector.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 font-display">{sector.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow">
                    {sector.potential}
                  </p>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">{sector.locations.split(',')[0]}</span>
                    <button
                      onClick={() => openSector(key)}
                      className="text-xs font-extrabold uppercase tracking-wider bg-mp-blueLight text-mp-blue hover:bg-mp-blue hover:text-white px-4 py-2 rounded-xl transition-all"
                    >
                      Ver oportunidades <i className="fa-solid fa-arrow-right ml-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
           6. AGRICULTURA E AGROINDÚSTRIA
      ========================================================= */}
      <section className="py-20 bg-gradient-to-br from-mp-greenLight/60 via-white to-mp-yellowLight/40 border-y border-mp-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
            <div>
              <span className="text-xs font-black text-mp-greenDark uppercase tracking-widest block mb-2">Cadeia de Valor Integrada</span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900">
                Agricultura & <span className="text-mp-greenDark">Agroindústria</span>
              </h2>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-mp-green/30 text-slate-800 font-extrabold text-sm sm:text-base">
              💡 Mensagem-chave: <span className="text-mp-greenDark">&ldquo;Produzir localmente. Transformar localmente. Criar maior valor.&rdquo;</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <i className="fa-solid fa-tractor text-mp-green text-2xl mb-3"></i>
              <h4 className="font-bold text-xs text-slate-800">Produção Comercial</h4>
              <p className="text-[11px] text-slate-500 mt-1">Hortícolas e cereais</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <i className="fa-solid fa-faucet-drip text-mp-blue text-2xl mb-3"></i>
              <h4 className="font-bold text-xs text-slate-800">Irrigação Precisa</h4>
              <p className="text-[11px] text-slate-500 mt-1">Tecnologias hídricas</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <i className="fa-solid fa-blender text-mp-yellowDark text-2xl mb-3"></i>
              <h4 className="font-bold text-xs text-slate-800">Processamento</h4>
              <p className="text-[11px] text-slate-500 mt-1">Agroalimentar</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <i className="fa-solid fa-snowflake text-cyan-600 text-2xl mb-3"></i>
              <h4 className="font-bold text-xs text-slate-800">Cadeia de Frio</h4>
              <p className="text-[11px] text-slate-500 mt-1">Armazenamento frio</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <i className="fa-solid fa-box-open text-amber-600 text-2xl mb-3"></i>
              <h4 className="font-bold text-xs text-slate-800">Embalagem</h4>
              <p className="text-[11px] text-slate-500 mt-1">Acondicionamento</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <i className="fa-solid fa-flask-vial text-mp-orange text-2xl mb-3"></i>
              <h4 className="font-bold text-xs text-slate-800">Insumos</h4>
              <p className="text-[11px] text-slate-500 mt-1">Biofertilizantes</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
           7. INDÚSTRIA E TRANSFORMAÇÃO
      ========================================================= */}
      <section className="py-20 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
            <div>
              <span className="text-xs font-black text-mp-yellow uppercase tracking-widest block mb-2">Capacidade Fabril</span>
              <h2 className="text-3xl sm:text-5xl font-black font-display leading-tight">
                Indústria & <span className="text-mp-blue">Transformação</span>
              </h2>
            </div>
            <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/15 text-white/90 font-extrabold text-sm sm:text-base">
              💡 Mensagem-chave: <span className="text-mp-yellow">&ldquo;Transformar recursos em produtos. Produtos em valor. Valor em crescimento.&rdquo;</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-mp-blue transition-all">
              <div className="text-mp-blue text-3xl mb-4"><i className="fa-solid fa-industry"></i></div>
              <h3 className="text-xl font-bold mb-3 font-display">Parques e Zonas Industriais</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Espaços consolidados e prontos para implantação rápida com água, energia de alta tensão, telecomunicações e segurança operacional integrada.
              </p>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-mp-green transition-all">
              <div className="text-mp-green text-3xl mb-4"><i className="fa-solid fa-cubes"></i></div>
              <h3 className="text-xl font-bold mb-3 font-display">Materiais de Construção & Ligeira</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Produção local de cimento, argamassas, estruturas metálicas, tubagens e cabos para abastecer o boom de infraestruturas do país e da região.
              </p>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-mp-yellow transition-all">
              <div className="text-mp-yellow text-3xl mb-4"><i className="fa-solid fa-recycle"></i></div>
              <h3 className="text-xl font-bold mb-3 font-display">Reciclagem & Economia Circular</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Reutilização e reciclagem de resíduos industriais, plásticos, vidro e metais com benefícios fiscais para projectos de cariz ecológico.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
           11. ZONAS E PLATAFORMAS DE INVESTIMENTO (Onde investir?)
      ========================================================= */}
      <section id="zonas" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mp-blueLight text-mp-blue text-xs font-black uppercase tracking-widest mb-3">
              <i className="fa-solid fa-layer-group"></i> Localizações Preparadas
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-900 leading-tight">
              Onde <span className="text-mp-blue">investir?</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
              Conheça as principais plataformas industriais e zonas económicas especiais com infraestruturas prontas para a instalação da sua empresa.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-mp-surface rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-mp-blue text-white">Parque Industrial</span>
                  <span className="text-xs font-bold text-slate-500">Boane</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 font-display">Parque Industrial de Beluluane</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  O maior e mais bem-sucedido parque industrial de Moçambique. Abriga a fundição Mozal e mais de 40 empresas com infraestruturas completas de água, energia de alta tensão e ferrovia.
                </p>
              </div>
              <button
                onClick={() => openLead('Parque Industrial Beluluane')}
                className="w-full bg-mp-blue hover:bg-mp-blueHover text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-center"
              >
                Saiba Mais & Instalação
              </button>
            </div>

            <div className="bg-mp-surface rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-mp-green text-white">Zona Económica Especial</span>
                  <span className="text-xs font-bold text-slate-500">Moamba</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 font-display">Zona Económica Especial de Moamba</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Plataforma estratégica em expansão no nó fronteiriço do Corredor de Maputo, com forte vocação para agroprocessamento e grandes centros logísticos de trânsito.
                </p>
              </div>
              <button
                onClick={() => openLead('ZEE Moamba')}
                className="w-full bg-mp-green hover:bg-mp-greenDark text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-center"
              >
                Saiba Mais & Oportunidades
              </button>
            </div>

            <div className="bg-mp-surface rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-mp-yellowDark text-white">Zona Franca</span>
                  <span className="text-xs font-bold text-slate-500">Província</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 font-display">Zona Franca Industrial</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Espaço orientado para actividades industriais orientadas para a exportação, oferecendo isenções alfandegárias de matérias-primas e benefícios fiscais altamente competitivos.
                </p>
              </div>
              <button
                onClick={() => openLead('Zona Franca Industrial')}
                className="w-full bg-mp-blueDeep hover:bg-black text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-center"
              >
                Saiba Mais & Enquadramento
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
           13. OPORTUNIDADES DE INVESTIMENTO (Filtros Interativos)
      ========================================================= */}
      <section id="oportunidades" className="py-24 bg-mp-surface scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mp-yellowLight text-mp-yellowDark text-xs font-black uppercase tracking-widest mb-3">
              <i className="fa-solid fa-briefcase"></i> Banco de Projectos
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-900 leading-tight">
              Encontre a sua <span className="text-mp-blue">oportunidade</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
              Filtre projectos e áreas estruturadas de investimento de acordo com o seu perfil empresarial.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 mb-10 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <i className="fa-solid fa-filter text-mp-blue mr-1"></i> Sector
                </label>
                <select
                  value={filterSector}
                  onChange={(e) => setFilterSector(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-mp-blue"
                >
                  <option value="todos">Todos os Sectores</option>
                  <option value="agricultura">Agricultura</option>
                  <option value="industria">Indústria</option>
                  <option value="logistica">Logística</option>
                  <option value="turismo">Turismo</option>
                  <option value="energia">Energia</option>
                  <option value="pesca">Pesca</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <i className="fa-solid fa-location-dot text-mp-green mr-1"></i> Distrito
                </label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-mp-green"
                >
                  <option value="todos">Todos os Distritos</option>
                  <option value="Matola">Matola</option>
                  <option value="Boane">Boane</option>
                  <option value="Moamba">Moamba</option>
                  <option value="Marracuene">Marracuene</option>
                  <option value="Matutuíne">Matutuíne</option>
                  <option value="Manhiça">Manhiça</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <i className="fa-solid fa-coins text-mp-yellowDark mr-1"></i> Dimensão
                </label>
                <select
                  value={filterScale}
                  onChange={(e) => setFilterScale(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-mp-yellowDark"
                >
                  <option value="todos">Todas as Dimensões</option>
                  <option value="media">Média Dimensão</option>
                  <option value="grande">Grande Escala</option>
                  <option value="estrategica">Projecto Estratégico</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opp) => (
              <div key={opp.id} className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${opp.badgeClass}`}>
                      {opp.sectorName}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{opp.location}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{opp.title}</h3>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">{opp.desc}</p>
                  <div className="text-[11px] font-bold text-slate-700 space-y-1 mb-4">
                    <div>Tipo: <span className="text-mp-blue">{opp.type}</span></div>
                    <div>Dimensão: <span className="text-mp-green">{opp.scaleLabel}</span></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => openLead(opp.title)}
                    className="w-full bg-mp-blue hover:bg-mp-blueHover text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Quero Investir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
           14. FACILITAÇÃO DO INVESTIMENTO (BAÚ)
      ========================================================= */}
      <section id="bau" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-mp-blueDeep via-mp-blue to-mp-blueDark rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-mp-yellow text-mp-blueDeep inline-block">
                  Facilitação Empresarial
                </span>
                <h2 className="text-3xl sm:text-5xl font-black font-display leading-tight">
                  Investir com mais <span className="text-mp-yellow">facilidade</span>
                </h2>
                <h3 className="text-lg sm:text-xl font-bold text-white/90">
                  Balcão de Atendimento Único — BAÚ
                </h3>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
                  O Balcão de Atendimento Único (BAÚ) é o seu ponto focal para formalização célere, emissão de alvarás, tramitação de terras (DUAT) e enquadramento nos benefícios fiscais do Governo de Moçambique.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
                <button
                  onClick={() => openLead('Apoio BAÚ')}
                  className="bg-mp-yellow hover:bg-mp-yellowDark text-mp-blueDeep py-4 px-8 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all text-center"
                >
                  <i className="fa-solid fa-comments mr-2"></i> Falar com a Equipa
                </button>
                <a
                  href="mailto:investimentos@dpic-maputo.gov.mz"
                  className="bg-white/10 hover:bg-white/20 border border-white/25 text-white py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all text-center"
                >
                  <i className="fa-regular fa-envelope mr-2 text-mp-yellow"></i> Contacto Directo BAÚ
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
           16. CHAMADA FINAL
      ========================================================= */}
      <section className="py-24 bg-mp-blueDeep text-white text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mp-yellow text-mp-blueDeep text-xs font-black uppercase tracking-widest">
            O Momento é Agora
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display leading-tight">
            O próximo grande investimento pode <span className="text-mp-yellow">começar aqui.</span>
          </h2>
          <p className="text-base sm:text-xl text-white/90 leading-relaxed font-normal max-w-3xl mx-auto">
            A Província de Maputo reúne localização estratégica, recursos, infraestruturas, capacidade produtiva, mercados e oportunidades para transformar investimento em crescimento.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => scrollTo('oportunidades')}
              className="bg-mp-yellow hover:bg-mp-yellowDark text-mp-blueDeep font-black px-8 py-4 rounded-2xl text-sm uppercase tracking-wider shadow-xl transition-all"
            >
              Explorar Oportunidades
            </button>
            <button
              onClick={() => openLead('Chamada Final')}
              className="bg-mp-green hover:bg-mp-greenDark text-white font-black px-8 py-4 rounded-2xl text-sm uppercase tracking-wider shadow-xl transition-all"
            >
              Contactar a Equipa de Investimento
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
           17. FOOTER INSTITUCIONAL COM QR CODE
      ========================================================= */}
      <footer id="contactos" className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/uploads/logo.png"
                  alt="Província de Maputo"
                  className="h-12 w-auto object-contain"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-400">República de Moçambique</span>
                  <span className="block text-sm font-black text-white">Governo da Província de Maputo</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direcção Provincial da Indústria e Comércio (DPIC). Promoção, atracção de investimentos e desenvolvimento industrial sustentável.
              </p>
              <p className="text-xs text-mp-yellow font-bold">
                61ª Edição da FACIM 2026 · Ricatla, Marracuene
              </p>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4">Navegação Rápida</h3>
              <ul className="space-y-2 text-xs text-slate-400 font-semibold">
                <li><button onClick={() => scrollTo('porque-maputo')} className="hover:text-mp-yellow transition-colors">Porquê Maputo?</button></li>
                <li><button onClick={() => scrollTo('corredores')} className="hover:text-mp-yellow transition-colors">Localização & Corredores</button></li>
                <li><button onClick={() => scrollTo('sectores')} className="hover:text-mp-yellow transition-colors">Sectores Estratégicos</button></li>
                <li><button onClick={() => scrollTo('zonas')} className="hover:text-mp-yellow transition-colors">Zonas Industriais & ZEE</button></li>
                <li><button onClick={() => scrollTo('oportunidades')} className="hover:text-mp-yellow transition-colors">Catálogo de Oportunidades</button></li>
                <li><button onClick={() => scrollTo('bau')} className="hover:text-mp-yellow transition-colors">Balcão Único (BAÚ)</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4">Contactos Oficiais</h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <i className="fa-solid fa-location-dot text-mp-blue mt-0.5"></i>
                  <span>Av. do Trabalho, Matola<br />Província de Maputo, Moçambique</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <i className="fa-solid fa-phone text-mp-green"></i>
                  <span>+258 21 720 000 / +258 84 000 0000</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <i className="fa-regular fa-envelope text-mp-yellow"></i>
                  <span>investimentos@dpic-maputo.gov.mz</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">QR Code Oficial</h3>
              <p className="text-xs text-slate-400">Acesse e partilhe este portal no smartphone.</p>
              <a
                href="https://maputofacim-kappa.vercel.app/en"
                target="_blank"
                rel="noopener noreferrer"
                className="w-32 h-32 bg-white p-2 rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 transition-transform block"
              >
                <img
                  src="/uploads/qrcode_maputo.png"
                  alt="QR Code Oficial Província de Maputo"
                  className="w-full h-full object-contain"
                />
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 Direcção Provincial da Indústria e Comércio — Província de Maputo. Todos os direitos reservados.</p>
            <p className="font-bold text-slate-400">PROVÍNCIA DE MAPUTO · O lugar certo para investir, viver e ser.</p>
          </div>
        </div>
      </footer>

      {/* =========================================================
           MODAL 1: DETALHES DO SECTOR
      ========================================================= */}
      {selectedSector && activeSectorData && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl p-6 sm:p-8 animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeSectorData.icon}</span>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 font-display">{activeSectorData.title}</h3>
                  <span className="text-xs font-bold text-mp-green uppercase tracking-wider">{activeSectorData.badge}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSector(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="space-y-6 text-sm text-slate-700">
              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-wider text-xs mb-2 text-mp-blue">Potencial & Vantagens Competitivas</h4>
                <p className="leading-relaxed text-slate-600">{activeSectorData.potential}</p>
              </div>

              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-wider text-xs mb-2 text-mp-green">Cadeias de Valor & Actividades</h4>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                  {activeSectorData.activities.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-mp-surface p-4 rounded-2xl border border-slate-200">
                <h4 className="font-black text-slate-900 uppercase tracking-wider text-xs mb-1 text-mp-orange">Localizações & Infraestruturas Relevantes</h4>
                <p className="text-xs text-slate-600">{activeSectorData.locations}</p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button onClick={() => setSelectedSector(null)} className="text-xs font-bold text-slate-500 hover:text-slate-800">
                Fechar
              </button>
              <button
                onClick={() => {
                  const title = activeSectorData.title;
                  setSelectedSector(null);
                  openLead(title);
                }}
                className="bg-mp-blue hover:bg-mp-blueHover text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Manifestar Interesse Neste Sector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
           MODAL 2: MANIFESTAÇÃO DE INTERESSE
      ========================================================= */}
      {leadModalOpen && (
        <div className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl p-6 sm:p-8 animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-mp-blue block">Apoio ao Investidor</span>
                <h3 className="text-xl font-black text-slate-900 font-display">Manifestação de Interesse</h3>
              </div>
              <button
                onClick={() => setLeadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dr. Carlos Tembe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-mp-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Empresa / Instituição</label>
                  <input
                    type="text"
                    placeholder="Ex: AgroMaputo Lda"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-mp-blue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">País / Origem *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Moçambique / RSA"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-mp-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+258 84 000 0000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-mp-blue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="invest@empresa.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-mp-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Área de Interesse</label>
                <input
                  type="text"
                  defaultValue={leadPreselectedSector}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mensagem ou Necessidades junto do BAÚ</label>
                <textarea
                  rows={3}
                  placeholder="Indique a estimativa de investimento, localização pretendida ou necessidades..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-mp-blue"
                ></textarea>
              </div>

              {leadSuccess && (
                <div className="p-3 bg-mp-greenLight border border-mp-green text-mp-greenDark rounded-xl font-bold text-xs">
                  Obrigado pelo seu interesse! Os dados foram submetidos com sucesso para a Equipa de Investimentos da Província de Maputo (BAÚ).
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-mp-blue hover:bg-mp-blueHover text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-colors"
              >
                {isSubmitting ? 'Submetendo...' : 'Submeter Manifestação de Interesse'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
