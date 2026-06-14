import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import styles from './page.module.css';
import { Link } from '@/i18n/routing';

// Fallback mock data in case DB is empty for demo purposes
const mockNoticias = [
  {
    slug: 'lancamento-plataforma-facim-2026',
    titulo: 'Lançamento da Plataforma FACIM 2026',
    resumo: 'A Direcção Provincial da Indústria e Comércio de Maputo anuncia o lançamento da plataforma digital para gestão da participação na FACIM 2026.',
    conteudo: 'A Direcção Provincial da Indústria e Comércio de Maputo tem o prazer de anunciar o lançamento oficial da sua nova plataforma digital, concebida para revolucionar a forma como a Província gere a sua participação na FACIM 2026.\n\nEsta plataforma inovadora centraliza todos os processos, desde a inscrição de expositores à gestão de patrocínios, garantindo uma experiência mais fluida, transparente e eficiente para todos os intervenientes.\n\nCom funcionalidades avançadas de backoffice, as empresas podem agora submeter as suas candidaturas online, acompanhar o estado em tempo real, e aceder a materiais de apoio exclusivos. Esta iniciativa marca um passo significativo na modernização administrativa da província e no apoio ao sector empresarial local.',
    categoria: 'Institucional',
    data: '12 Jun 2026',
  },
  {
    slug: 'abertura-inscricoes-expositores',
    titulo: 'Abertura das Inscrições para Expositores',
    resumo: 'As inscrições para participação como expositor na FACIM 2026 estão oficialmente abertas. Empresas da Província de Maputo podem registar-se através da plataforma.',
    conteudo: 'Informamos todos os interessados que as inscrições para participação como expositor no pavilhão da Província de Maputo na FACIM 2026 encontram-se abertas a partir de hoje.\n\nAs empresas interessadas deverão aceder ao portal, criar a sua conta de expositor e preencher o formulário de candidatura. Os critérios de selecção darão prioridade a empresas com produtos inovadores, potencial de exportação e que representem o desenvolvimento sustentável da província.\n\nO prazo para submissão da primeira fase de candidaturas encerra a 30 de Julho de 2026. Não perca a oportunidade de destacar a sua marca no maior evento comercial de Moçambique.',
    categoria: 'Inscrições',
    data: '12 Jun 2026',
  },
  {
    slug: 'reuniao-preparatoria-distritos',
    titulo: 'Reunião Preparatória com os Distritos',
    resumo: 'Realizou-se a primeira reunião preparatória com representantes dos 8 distritos da Província de Maputo para coordenar a participação na FACIM.',
    conteudo: 'Teve lugar esta manhã a primeira reunião alargada de coordenação entre a Direcção Provincial e os representantes das actividades económicas dos 8 distritos da Província de Maputo.\n\nO encontro serviu para alinhar a estratégia de mobilização de empresas locais, artesãos e produtores agrários. Ficou estabelecido que cada distrito terá a responsabilidade de pré-seleccionar os seus melhores talentos e produtos para garantir uma representação equitativa e de excelência no pavilhão provincial.\n\nFoi também debatido o tema transversal deste ano, focado na inovação agrícola e industrial.',
    categoria: 'Preparação',
    data: '10 Jun 2026',
  },
  {
    slug: 'pacotes-patrocinio-disponiveis',
    titulo: 'Pacotes de Patrocínio Já Disponíveis',
    resumo: 'Conheça os quatro pacotes de patrocínio — Platinum, Gold, Silver e Bronze — e associe a sua marca à maior feira de Moçambique.',
    conteudo: 'A organização da participação da Província de Maputo na FACIM 2026 acaba de lançar o programa de parcerias corporativas, disponibilizando quatro pacotes de patrocínio desenhados para maximizar a visibilidade das marcas associadas.\n\nOs pacotes Platinum, Gold, Silver e Bronze oferecem diferentes níveis de contrapartidas, que incluem desde branding destacado no pavilhão, menções na plataforma digital, até oportunidades exclusivas de B2B durante o evento.\n\nEmpresas interessadas podem consultar os detalhes e manifestar o seu interesse directamente no painel de Patrocinador deste portal.',
    categoria: 'Patrocínios',
    data: '8 Jun 2026',
  },
  {
    slug: 'calendario-actividades-preparatorias',
    titulo: 'Calendário de Actividades Preparatórias',
    resumo: 'O calendário com todas as actividades preparatórias para a FACIM 2026 já está disponível. Consulte as datas importantes na secção de Cronograma.',
    conteudo: 'Para assegurar que nenhum prazo é esquecido, a organização disponibilizou publicamente o calendário integral de actividades preparatórias para a FACIM 2026.\n\nEste cronograma inclui marcos importantes como o fecho de inscrições, datas das sessões de formação, visitas de inspecção aos stands, e a montagem final do pavilhão.\n\nRecomendamos a todos os parceiros e expositores que consultem regularmente a página de "Cronograma" no portal para estarem a par de eventuais ajustamentos.',
    categoria: 'Cronograma',
    data: '5 Jun 2026',
  },
  {
    slug: 'formacao-empresas-participantes',
    titulo: 'Formação para Empresas Participantes',
    resumo: 'Série de formações para empresas inscritas sobre como maximizar a sua presença na FACIM 2026, incluindo técnicas de exposição e networking.',
    conteudo: 'A DPIC Maputo tem o orgulho de anunciar um ciclo de capacitação dedicado exclusivamente às empresas seleccionadas para expor na FACIM 2026.\n\nEstas sessões formativas abrangerão temas cruciais como: Design e Montagem de Stands Atrativos, Técnicas de Venda e Abordagem de Clientes em Feiras, Preparação de Material Promocional, e Estratégias de Networking B2B.\n\nAs formações ocorrerão em formato híbrido (presencial e virtual) durante o mês de Agosto, garantindo que os nossos expositores estão plenamente preparados para converter a sua participação em negócios concretos.',
    categoria: 'Formação',
    data: '2 Jun 2026',
  },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const noticia = await prisma.noticia.findUnique({
    where: { slug },
  });

  if (noticia) {
    return {
      title: noticia.titulo,
      description: noticia.resumo,
    };
  }

  const mock = mockNoticias.find((n) => n.slug === slug);
  if (mock) {
    return {
      title: mock.titulo,
      description: mock.resumo,
    };
  }

  return { title: 'Notícia não encontrada' };
}

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Try database first
  let noticia: any;
  
  try {
    noticia = await prisma.noticia.findUnique({
      where: { slug },
    });
  } catch (e) {
    console.error(e);
  }

  let dataPublicacao = '';

  if (noticia) {
    dataPublicacao = noticia.publishedAt ? new Date(noticia.publishedAt).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
  } else {
    // Fallback to mock
    noticia = mockNoticias.find((n) => n.slug === slug);
    if (!noticia) {
      notFound();
    }
    dataPublicacao = noticia.data;
  }

  return (
    <>
      <section className={styles.articleHero}>
        <div className={styles.container}>
          <Link href="/noticias" className={styles.backLink}>
            <i className="ti ti-arrow-left"></i> Voltar para Notícias
          </Link>
          
          <div className={styles.metaRow}>
            <span className="badge badge-orange">{noticia.categoria || 'Geral'}</span>
            <span className={styles.date}>{dataPublicacao}</span>
          </div>
          
          <h1 className={styles.title}>{noticia.titulo}</h1>
          <p className={styles.resumo}>{noticia.resumo}</p>
        </div>
      </section>

      <div className={styles.container}>
        {noticia.imagem && (
          <div className={styles.coverImage}>
            <img src={noticia.imagem} alt={noticia.titulo} />
          </div>
        )}

        <section className={styles.articleBody}>
          <div className={styles.content}>
            {noticia.conteudo}
          </div>

          {noticia.videoLink && (
            <div className={styles.videoSection}>
              <h3 style={{ marginBottom: '16px', fontFamily: 'var(--font-display)', fontSize: '24px' }}>Vídeo Relacionado</h3>
              <div className={styles.videoContainer}>
                <iframe 
                  src={noticia.videoLink.replace('watch?v=', 'embed/')} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
