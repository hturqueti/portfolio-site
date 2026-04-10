import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Image from 'next/image'
import { existsSync } from 'node:fs'
import path from 'node:path'

type IconProps = {
  className?: string
}

type InterestArea = {
  title: string
  description: string
  iconSrc: string
  iconClassName?: string
}

type Role = {
  title: string
  period: DateRange
  activities: ReactNode[]
}

type ExperienceGroup = {
  company: string
  period: DateRange
  description: string
  logoText: string
  logoSrc?: string
  roles: Role[]
}

type EducationItem = {
  institution: string
  title: string
  period: DateRange
  description: string
  finalProject?: string
  logoText: string
  logoSrc?: string
}

type MonthKey =
  | 'jan'
  | 'fev'
  | 'mar'
  | 'abr'
  | 'mai'
  | 'jun'
  | 'jul'
  | 'ago'
  | 'set'
  | 'out'
  | 'nov'
  | 'dez'

type PartialDate = {
  month: MonthKey
  year: number
}

type DateRange = {
  start: PartialDate
  end?: PartialDate
  isCurrent?: boolean
}

type PeriodFormat = {
  yearStyle: '2-digit' | 'numeric'
  separator: string
  rangeSeparator: string
  currentLabel: string
}

const interestAreas: InterestArea[] = [
  {
    title: 'Machine Learning',
    description: 'Desenvolvimento de modelos preditivos, avaliação rigorosa e tradução de resultados analíticos em decisões práticas orientadas a negócio.',
    iconSrc: '/images/icons/brain.svg',
  },
  {
    title: 'Deep Learning',
    description: 'Aplicação de redes neurais para problemas complexos, com foco em desempenho, generalização e experimentação reprodutível.',
    iconSrc: '/images/icons/binary-tree-2.svg',
    iconClassName: 'interest-icon-image-rotated',
  },
  {
    title: 'Visualização de dados',
    description: 'Criação de narrativas visuais claras que destacam padrões, anomalias e indicadores relevantes para diferentes públicos.',
    iconSrc: '/images/icons/chart-bar.svg',
  },
  {
    title: 'Estatística',
    description: 'Uso de fundamentos estatísticos para inferência, testes, modelagem e interpretação robusta de fenômenos observados nos dados.',
    iconSrc: '/images/icons/chart-histogram.svg',
  },
  {
    title: 'Computação em nuvem',
    description: 'Interesse em arquiteturas escaláveis para dados e IA, com atenção a custos, automação e confiabilidade operacional.',
    iconSrc: '/images/icons/cloud-computing.svg',
  },
  {
    title: 'IA Generativa',
    description: 'Exploração de LLMs e aplicações generativas para acelerar análises, interfaces inteligentes e fluxos de trabalho.',
    iconSrc: '/images/icons/sparkles-2.svg',
  },
] as const

const MONTH_LABELS: Record<MonthKey, string> = {
  jan: 'jan',
  fev: 'fev',
  mar: 'mar',
  abr: 'abr',
  mai: 'mai',
  jun: 'jun',
  jul: 'jul',
  ago: 'ago',
  set: 'set',
  out: 'out',
  nov: 'nov',
  dez: 'dez',
}

const PERIOD_FORMAT: PeriodFormat = {
  yearStyle: '2-digit',
  separator: '/',
  rangeSeparator: ' - ',
  currentLabel: 'atual',
}

const CAREER_START_YEAR = 2018

function formatPartialDate(date: PartialDate) {
  const year =
    PERIOD_FORMAT.yearStyle === 'numeric'
      ? String(date.year)
      : String(date.year).slice(-2)

  return `${MONTH_LABELS[date.month]}${PERIOD_FORMAT.separator}${year}`
}

function formatDateRange(period: DateRange) {
  const start = formatPartialDate(period.start)

  if (period.isCurrent) {
    return `${start}${PERIOD_FORMAT.rangeSeparator}${PERIOD_FORMAT.currentLabel}`
  }

  if (period.end) {
    return `${start}${PERIOD_FORMAT.rangeSeparator}${formatPartialDate(period.end)}`
  }

  return start
}

function getRangeEnd(period: DateRange): PartialDate {
  if (period.isCurrent) {
    const today = new Date()
    const monthIndex = today.getMonth()
    const monthKeys: MonthKey[] = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

    return {
      month: monthKeys[monthIndex],
      year: today.getFullYear(),
    }
  }

  return period.end ?? period.start
}

function getMonthIndex(month: MonthKey) {
  const monthOrder: MonthKey[] = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return monthOrder.indexOf(month)
}

function formatDuration(period: DateRange) {
  const end = getRangeEnd(period)
  const totalMonths =
    (end.year - period.start.year) * 12 +
    (getMonthIndex(end.month) - getMonthIndex(period.start.month)) +
    1

  if (totalMonths <= 0) {
    return '(menos de 1 mês)'
  }

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const parts: string[] = []

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`)
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`)
  }

  return `(${parts.join(' e ')})`
}

function formatPeriodWithDuration(period: DateRange) {
  return `${formatDateRange(period)} ${formatDuration(period)}`
}

function getPeriodKey(period: DateRange) {
  const start = `${period.start.year}-${period.start.month}`
  const end = period.isCurrent
    ? 'current'
    : period.end
      ? `${period.end.year}-${period.end.month}`
      : 'open'

  return `${start}_${end}`
}

const professionalExperience: ExperienceGroup[] = [
  {
    company: 'Itaú Unibanco',
    period: {
      start: { month: 'dez', year: 2023 },
      isCurrent: true,
    },
    description: 'Atuação na área de People Analytics, com ampliação de escopo para ciência de dados aplicada a RH e automação inteligente.',
    logoText: 'IU',
    logoSrc: '/images/companies/itau-unibanco.webp',
    roles: [
      {
        title: 'Cientista de Dados Sr.',
        period: {
          start: { month: 'ago', year: 2025 },
          isCurrent: true,
        },
        activities: [
          'Desenvolvimento de chatbot corporativo utilizando LangChain e LangGraph integrado à OpenAI;',
          'Criação de agentes inteligentes e automações com Python, SQL e AWS;',
          'Aplicação de NLP, engenharia de prompt e análise avançada para suporte a processos de RH;',
          <>Construção de soluções escaláveis em <em>cloud</em>, com foco em eficiência e redução de esforço manual.</>
        ],
      },
      {
        title: 'Analista de People Analytics Sr.',
        period: {
          start: { month: 'ago', year: 2024 },
          end: { month: 'jul', year: 2025 },
        },
        activities: [
          'Estudos estatísticos de remuneração e análises de equidade salarial para relatórios oficiais;',
          'Participação na valoração de projetos de dados com foco em impacto e eficiência;',
          'Análises com Python, SQL e AWS Glue, Athena, QuickSight e SageMaker;',
          <>Entrega de <em>storytelling</em> analítico para executivos.</>
        ],
      },
      {
        title: 'Analista de People Analytics',
        period: {
          start: { month: 'dez', year: 2023 },
          end: { month: 'jul', year: 2024 },
        },
        activities: [
          <><em>Dashboards</em> de indicadores de remuneração no QuickSight;</>,
          'Análise de sentimentos em pesquisas utilizando NLP',
          'Testes de hipótese para identificação de vieses em avaliações de desempenho;',
          <>Estudos sobre remuneração, saúde, <em>turnover</em> e <em>performance</em> usando Python e SQL.</>,
        ],
      },
    ],
  },
  {
    company: 'Itaú BBA',
    period: {
      start: { month: 'jun', year: 2019 },
      end: { month: 'nov', year: 2023 },
    },
    description: 'Trajetória construída na área de analytics do banco de atacado, com atuação voltada a dados, eficiência comercial e geração de oportunidades para o negócio.',
    logoText: 'IB',
    logoSrc: '/images/companies/itau-bba.webp',
    roles: [
      {
        title: 'Analista de Analytics',
        period: {
          start: { month: 'jul', year: 2022 },
          end: { month: 'nov', year: 2023 },
        },
        activities: [
          <>Desenvolvimento de modelo de geração de leads que contribuiu com 100 milhões em crédito contratado;</>,
          'Construção de fluxos ETLT em AWS para processamento de grandes bases (~10M registros/dia) com Athena, Glue e PySpark.'
        ],
      },
      {
        title: 'Analista de Dados',
        period: {
          start: { month: 'abr', year: 2021 },
          end: { month: 'jun', year: 2022 },
        },
        activities: [
          'Segmento Middle Market: definição de clientes target e gamificação de abertura de contas;',
          'Criação de dashboard em Power BI para análise de satisfação dos usuários;',
          'Automação e scripts em Python e R para suporte às áreas de negócio.'
        ],
      },
      {
        title: 'Analista de Dados Jr.',
        period: {
          start: { month: 'jun', year: 2019 },
          end: { month: 'mar', year: 2021 },
        },
        activities: [
          <>Tratamento e ingestão de dados de NPS e implementação de sistema de <em>call-back</em> para ação dos gerentes comerciais;</>,
          <>Criação e implantação de processos <em>batch</em> com SSIS para alimentar o servidor de dados da ferramenta de gestão de clientes;</>,
          <>Coleta e processamento de dados financeiros para avaliação de performance comercial e <em>cash management</em>;</>,
          <>Segmentação de público elegível para comunicação em parceria com a área de <em>marketing</em>.</>
        ],
      },
    ],
  },
  {
    company: 'Itaú Unibanco',
    period: {
      start: { month: 'mai', year: 2018 },
      end: { month: 'mai', year: 2019 },
    },
    description: 'Ingresso no programa de estágio corporativo e atuação na área de Conta Corrente PJ.',
    logoText: 'IU',
    logoSrc: '/images/companies/itau-unibanco.webp',
    roles: [
      {
        title: 'Estagiário',
        period: {
          start: { month: 'mai', year: 2018 },
          end: { month: 'mai', year: 2019 },
        },
        activities: [
          <>Estruturação de relatório para identificar represamento de solicitações de aberturas de contas e assim adequar dinamicamente o <em>capacity</em> do time de operações;</>,
          <>Avaliação de fluxos de exceção em isenções de tarifas para clientes <em>target</em> proporcionando uma maior conversão na abertura de contas.</>
        ],
      },
    ],
  },
]

const academicBackground: EducationItem[] = [
  {
    institution: 'Universidade Tecnológica Federal do Paraná',
    title: 'Pós-graduação em Ciência de Dados',
    period: {
      start: { month: 'mar', year: 2021 },
      end: { month: 'nov', year: 2022 },
    },
    description: '',
    finalProject: 'Modelos de Aprendizado de Máquina para Previsão do Preço do Óleo Diesel na Região Sudeste do Brasil',
    logoText: 'PG',
    logoSrc: '/images/education/utfpr.webp',
  },
  {
    institution: 'Universidade Federal de São Paulo',
    title: 'Graduação em Engenharia Química',
    period: {
      start: { month: 'mai', year: 2013 },
      end: { month: 'jun', year: 2019 },
    },
    description: '',
    finalProject: 'Equilíbrio Líquido-Vapor da mistura R1234yf - R23 via Redes Neurais Artificiais',
    logoText: 'UN',
    logoSrc: '/images/education/unifesp.webp',
  },
]

export const metadata: Metadata = {
  title: 'Sobre mim | Henrique Marques Turqueti',
  description: 'Página com resumo profissional, áreas de interesse, experiência e formação acadêmica.',
}

function hasPublicAsset(src?: string) {
  if (!src || !src.startsWith('/')) {
    return false
  }

  return existsSync(path.join(process.cwd(), 'public', src.slice(1)))
}

function TimelineLogo({
  logoText,
  logoSrc,
  alt,
  academic = false,
}: {
  logoText: string
  logoSrc?: string
  alt: string
  academic?: boolean
}) {
  const showImage = hasPublicAsset(logoSrc)

  return (
    <div className={`timeline-logo${academic ? ' timeline-logo-academic' : ''}`} aria-hidden={showImage ? undefined : 'true'}>
      {showImage ? (
        <Image
          src={logoSrc!}
          alt={alt}
          width={100}
          height={100}
          className="timeline-logo-image"
        />
      ) : (
        logoText
      )}
    </div>
  )
}

export default function AboutPage() {
  const yearsOfExperience = new Date().getFullYear() - CAREER_START_YEAR

  return (
    <div className="about-page">
      <section className="container section profile-hero">
        <div className="profile-photo-wrap">
          <Image
            src="/images/profile/profile-picture.webp"
            alt="Foto de Henrique Marques Turqueti"
            width={560}
            height={560}
            priority
            className="profile-photo"
          />
        </div>

        <div className="profile-intro">
          <p className="eyebrow">Sobre mim</p>
          <h1>
            Henrique Marques <span className="gradient-text">Turqueti</span>
          </h1>
          <p className="profile-summary placeholder-copy">
            Engenheiro químico com pós-graduação em Ciência de Dados e mais de {yearsOfExperience} anos de experiência no setor financeiro. Atuei no Itaú Unibanco e no Itaú BBA com desenvolvimento de modelos, análises de comportamento de clientes e otimização de processos, e atualmente trabalho com <em>People Analytics</em>, gerando <em>insights</em> sobre remuneração, saúde, <em>turnover</em> e <em>performance</em> para apoiar decisões estratégicas.
          </p>
        </div>
      </section>

      <section className="container section">
        <div className="section-header section-header-stack">
          <div>
            <h2>Áreas de interesse</h2>
            <p className="section-copy">
              Temas que concentram meu interesse de estudo e prática, com foco em modelagem, análise e aplicação de IA a problemas reais.
            </p>
          </div>
        </div>

        <div className="interest-grid">
          {interestAreas.map(({ title, description, iconSrc, iconClassName }) => (
            <article key={title} className="interest-card">
              <div className="interest-header">
                <div className="interest-icon">
                  <Image
                    src={iconSrc}
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden="true"
                    className={`interest-icon-image${iconClassName ? ` ${iconClassName}` : ''}`}
                  />
                </div>
                <h3>{title}</h3>
              </div>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-header section-header-stack">
          <div>
            <h2>Experiência profissional</h2>
            <p className="section-copy">
              Trajetória em dados no setor financeiro, passando por analytics,modelagem, automação e ciência de dados em diferentes contextos de negócio.
            </p>
          </div>
        </div>

        <div className="timeline">
          {professionalExperience.map((item) => (
            <article key={`${item.company}-${getPeriodKey(item.period)}`} className="timeline-item timeline-item-grouped">
              <TimelineLogo logoText={item.logoText} logoSrc={item.logoSrc} alt={`Logo da empresa ${item.company}`} />
              <div className="timeline-content surface-card">
                <div className="timeline-meta">
                  <div>
                    <p className="timeline-company">{item.company}</p>
                    <h3>{item.company}</h3>
                  </div>
                  <p className="timeline-period">{formatPeriodWithDuration(item.period)}</p>
                </div>
                <p className="placeholder-copy timeline-group-description">{item.description}</p>
                <div className="timeline-role-list">
                  {item.roles.map((role) => (
                    <div key={`${item.company}-${role.title}-${getPeriodKey(role.period)}`} className="timeline-role">
                      <div className="timeline-meta timeline-role-meta">
                        <div>
                          <h4>{role.title}</h4>
                        </div>
                        <p className="timeline-period">{formatPeriodWithDuration(role.period)}</p>
                      </div>
                      <ul className="timeline-activity-list placeholder-copy">
                        {role.activities.map((activity, activityIndex) => (
                          <li key={`${role.title}-${getPeriodKey(role.period)}-${activityIndex}`}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-header section-header-stack">
          <div>
            <h2>Formação acadêmica</h2>
            <p className="section-copy">
              Formação voltada a fundamentos quantitativos e computacionais, com evolução para estatística, modelagem e aprendizado de máquina.
            </p>
          </div>
        </div>

        <div className="timeline">
          {academicBackground.map((item) => (
            <article key={`${item.institution}-${item.title}`} className="timeline-item">
              <TimelineLogo
                logoText={item.logoText}
                logoSrc={item.logoSrc}
                alt={`Logo de ${item.institution}`}
                academic
              />
              <div className="timeline-content surface-card">
                <div className="timeline-meta">
                  <div>
                    <p className="timeline-company">{item.institution}</p>
                    <h3>{item.title}</h3>
                  </div>
                  <p className="timeline-period">{formatPeriodWithDuration(item.period)}</p>
                </div>
                <p className="placeholder-copy">{item.description}</p>
                {item.finalProject ? (
                  <div className="timeline-extra-block">
                    <p className="timeline-extra-title">Trabalho de conclusão de curso</p>
                    <p className="placeholder-copy">{item.finalProject}</p>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
