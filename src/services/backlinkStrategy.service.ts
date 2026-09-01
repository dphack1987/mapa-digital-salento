/**
 * Servicio de Estrategia de Backlinks Internacionales
 * Especializado en generar backlinks para SEO internacional, especialmente para China y Asia
 */

interface BacklinkSource {
  platform: string
  country: string
  language: string
  domainAuthority: string
  strategy: string
  priority: 'high' | 'medium' | 'low'
  estimatedImpact: string
  difficulty: string
  cost: string
}

interface ContentLocalization {
  language: string
  region: string
  contentType: string
  priority: 'high' | 'medium' | 'low'
  contentNeeds: string[]
  culturalAdaptations: string[]
}

class BacklinkStrategyService {
  private domain: string = 'https://mapa-digital-salento.vercel.app'
  private brandName: string = 'Salento a la Mano'

  /**
   * Obtener fuentes de backlinks chinas para Baidu
   */
  getChineseBacklinkSources(): BacklinkSource[] {
    return [
      {
        platform: 'WeChat',
        country: 'China',
        language: 'zh-CN',
        domainAuthority: 'Alta',
        strategy: 'Crear cuenta oficial y publicar contenido sobre turismo en Colombia',
        priority: 'high',
        estimatedImpact: 'Muy alto - Baidu indexa WeChat',
        difficulty: 'Alta - requiere cuenta empresarial verificada',
        cost: 'Gratuito pero requiere inversión de tiempo'
      },
      {
        platform: 'Weibo',
        country: 'China',
        language: 'zh-CN',
        domainAuthority: 'Alta',
        strategy: 'Publicar contenido interactivo sobre Salento y Colombia',
        priority: 'high',
        estimatedImpact: 'Alto - Baidu prioriza Weibo',
        difficulty: 'Media - registro accesible',
        cost: 'Gratuito'
      },
      {
        platform: 'Baidu Tieba',
        country: 'China',
        language: 'zh-CN',
        domainAuthority: 'Media',
        strategy: 'Participar en foros de turismo internacional con enlaces al sitio',
        priority: 'high',
        estimatedImpact: 'Medio - foros Baidu',
        difficulty: 'Media - requiere participación activa',
        cost: 'Gratuito'
      },
      {
        platform: 'Zhihu',
        country: 'China',
        language: 'zh-CN',
        domainAuthority: 'Alta',
        strategy: 'Responder preguntas sobre turismo en Colombia y Latinoamérica',
        priority: 'medium',
        estimatedImpact: 'Alto - contenido Q&A de alta calidad',
        difficulty: 'Media - requiere conocimiento del idioma',
        cost: 'Gratuito'
      },
      {
        platform: 'Douban',
        country: 'China',
        language: 'zh-CN',
        domainAuthority: 'Media',
        strategy: 'Crear grupos sobre turismo latinoamericano',
        priority: 'medium',
        estimatedImpact: 'Medio - comunidad cultural',
        difficulty: 'Media - requiere construcción de comunidad',
        cost: 'Gratuito'
      },
      {
        platform: 'Bilibili',
        country: 'China',
        language: 'zh-CN',
        domainAuthority: 'Alta',
        strategy: 'Subir videos sobre turismo en Salento con enlaces',
        priority: 'medium',
        estimatedImpact: 'Alto - plataforma de video muy popular',
        difficulty: 'Media - requiere producción de video',
        cost: 'Gratuito pero requiere inversión en contenido'
      },
      {
        platform: 'Xiaohongshu (Little Red Book)',
        country: 'China',
        language: 'zh-CN',
        domainAuthority: 'Alta',
        strategy: 'Publicar guías de viaje con fotos y enlaces',
        priority: 'high',
        estimatedImpact: 'Muy alto - plataforma de lifestyle/travel',
        difficulty: 'Media - contenido visual requerido',
        cost: 'Gratuito'
      }
    ]
  }

  /**
   * Obtener fuentes de backlinks para Taiwán y Hong Kong (Google)
   */
  getTaiwanHongKongBacklinkSources(): BacklinkSource[] {
    return [
      {
        platform: 'PTT (Taiwan)',
        country: 'Taiwán',
        language: 'zh-TW',
        domainAuthority: 'Alta',
        strategy: 'Participar en foros de turismo con enlaces relevantes',
        priority: 'high',
        estimatedImpact: 'Alto - mayor foro de Taiwán',
        difficulty: 'Media - requiere conocimiento del idioma',
        cost: 'Gratuito'
      },
      {
        platform: 'Dcard (Taiwan)',
        country: 'Taiwán',
        language: 'zh-TW',
        domainAuthority: 'Media',
        strategy: 'Publicar en comunidades de viajes internacionales',
        priority: 'medium',
        estimatedImpact: 'Medio - plataforma social popular',
        difficulty: 'Media - requiere creación de contenido',
        cost: 'Gratuito'
      },
      {
        platform: 'Hong Kong Golden Forum',
        country: 'Hong Kong',
        language: 'zh-HK',
        domainAuthority: 'Media',
        strategy: 'Participar en discusiones sobre turismo internacional',
        priority: 'medium',
        estimatedImpact: 'Medio - comunidad local activa',
        difficulty: 'Media - requiere participación continua',
        cost: 'Gratuito'
      },
      {
        platform: 'Uwants (Hong Kong)',
        country: 'Hong Kong',
        language: 'zh-HK',
        domainAuthority: 'Media',
        strategy: 'Contribuir en secciones de viajes con enlaces útiles',
        priority: 'medium',
        estimatedImpact: 'Medio - foro establecido',
        difficulty: 'Media - requiere tiempo para participar',
        cost: 'Gratuito'
      }
    ]
  }

  /**
   * Obtener fuentes de backlinks para Sureste Asiático (Google)
   */
  getSoutheastAsiaBacklinkSources(): BacklinkSource[] {
    return [
      {
        platform: 'Pantip (Tailandia)',
        country: 'Tailandia',
        language: 'th-TH',
        domainAuthority: 'Alta',
        strategy: 'Crear posts sobre destinos latinoamericanos',
        priority: 'high',
        estimatedImpact: 'Alto - mayor foro de Tailandia',
        difficulty: 'Media - requiere traducción y adaptación cultural',
        cost: 'Gratuito'
      },
      {
        platform: 'LowEndTalk (Vietnam)',
        country: 'Vietnam',
        language: 'vi-VN',
        domainAuthority: 'Media',
        strategy: 'Participar en comunidades de viajes internacionales',
        priority: 'medium',
        estimatedImpact: 'Medio - comunidad tech/emprendedores',
        difficulty: 'Media - requiere construcción de reputación',
        cost: 'Gratuito'
      },
      {
        platform: 'Kaskus (Indonesia)',
        country: 'Indonesia',
        language: 'id-ID',
        domainAuthority: 'Alta',
        strategy: 'Contribuir en foros de viajes con contenido útil',
        priority: 'high',
        estimatedImpact: 'Alto - mayor foro de Indonesia',
        difficulty: 'Media - requiere tiempo y participación',
        cost: 'Gratuito'
      },
      {
        platform: 'Lowyat.net (Malasia)',
        country: 'Malasia',
        language: 'ms-MY',
        domainAuthority: 'Media',
        strategy: 'Participar en secciones de viajes internacionales',
        priority: 'medium',
        estimatedImpact: 'Medio - comunidad establecida',
        difficulty: 'Media - requiere conocimiento del idioma',
        cost: 'Gratuito'
      },
      {
        platform: 'SGClub (Singapur)',
        country: 'Singapur',
        language: 'en-SG',
        domainAuthority: 'Media',
        strategy: 'Publicar en foros de viajes con enlaces relevantes',
        priority: 'medium',
        estimatedImpact: 'Medio - comunidad singapurense',
        difficulty: 'Baja - inglés como idioma principal',
        cost: 'Gratuito'
      }
    ]
  }

  /**
   * Obtener necesidades de localización de contenido
   */
  getContentLocalizationNeeds(): ContentLocalization[] {
    return [
      {
        language: 'zh-CN',
        region: 'China',
        contentType: 'Chino Simplificado Completo',
        priority: 'high',
        contentNeeds: [
          'Versión completa del sitio en chino simplificado',
          'Adaptación cultural para mainland China',
          'Contenido optimizado para Baidu SEO',
          'Imágenes con alt text en chino',
          'Videos con subtítulos en chino'
        ],
        culturalAdaptations: [
          'Evitar temas políticos sensibles',
          'Enfocarse en turismo de naturaleza y cultura',
          'Usar referencias culturales chinas apropiadas',
          'Incluir información sobre accesibilidad desde China'
        ]
      },
      {
        language: 'zh-TW',
        region: 'Taiwán',
        contentType: 'Chino Tradicional Taiwanés',
        priority: 'medium',
        contentNeeds: [
          'Versión parcial en chino tradicional taiwanés',
          'Meta tags específicos para Google Taiwán',
          'Contenido adaptado para turistas taiwaneses',
          'Referencias a cultura taiwanesa apropiadas'
        ],
        culturalAdaptations: [
          'Uso de caracteres tradicionales taiwaneses',
          'Referencias a comida taiwanesa',
          'Adaptación de estilo de comunicación taiwanés'
        ]
      },
      {
        language: 'zh-HK',
        region: 'Hong Kong',
        contentType: 'Chino Tradicional Hong Kong',
        priority: 'medium',
        contentNeeds: [
          'Versión parcial en chino tradicional hongkonés',
          'Meta tags específicos para Google Hong Kong',
          'Contenido adaptado para turismo de negocios',
          'Información sobre conectividad desde HK'
        ],
        culturalAdaptations: [
          'Uso de caracteres tradicionales hongkoneses',
          'Enfoque en experiencias premium',
          'Referencias a cultura de negocios de HK'
        ]
      },
      {
        language: 'th-TH',
        region: 'Tailandia',
        contentType: 'Tailandés Parcial',
        priority: 'medium',
        contentNeeds: [
          'Meta descriptions en tailandés',
          'Títulos optimizados en tailandés',
          'Guías básicas en tailandés',
          'Keywords en tailandés'
        ],
        culturalAdaptations: [
          'Respeto a cultura budista',
          'Enfoque en naturaleza y espiritualidad',
          'Adaptación de estilo tailandés de comunicación'
        ]
      },
      {
        language: 'vi-VN',
        region: 'Vietnam',
        contentType: 'Vietnamita Parcial',
        priority: 'medium',
        contentNeeds: [
          'Meta descriptions en vietnamita',
          'Títulos optimizados en vietnamita',
          'Keywords en vietnamita',
          'Contenido básico en vietnamita'
        ],
        culturalAdaptations: [
          'Respeto a cultura vietnamita',
          'Enfoque en experiencias auténticas',
          'Adaptación de estilo vietnamita'
        ]
      },
      {
        language: 'id-ID',
        region: 'Indonesia',
        contentType: 'Indonesio Parcial',
        priority: 'medium',
        contentNeeds: [
          'Meta descriptions en indonesio',
          'Títulos optimizados en indonesio',
          'Keywords en indonesio',
          'Contenido básico en indonesio'
        ],
        culturalAdaptations: [
          'Respeto a cultura islámica',
          'Enfoque en experiencias familiares',
          'Adaptación de estilo indonesio'
        ]
      },
      {
        language: 'ms-MY',
        region: 'Malasia',
        contentType: 'Malayo Parcial',
        priority: 'medium',
        contentNeeds: [
          'Meta descriptions en malayo',
          'Títulos optimizados en malayo',
          'Keywords en malayo',
          'Contenido básico en malayo'
        ],
        culturalAdaptations: [
          'Respeto a cultura multicultural malaya',
          'Enfoque en experiencias halal',
          'Adaptación de estilo malayo'
        ]
      }
    ]
  }

  /**
   * Generar estrategia completa de backlinks internacionales
   */
  generateInternationalBacklinkStrategy(): string {
    return '# Estrategia Completa de Backlinks Internacionales\n\n'
      + '## Dominio: ' + this.domain + '\n'
      + '## Marca: ' + this.brandName + '\n\n'
      + '## Estrategia Principal: Backlinks para Indexación Internacional\n\n'
      + '### 🇨🇳 China (Baidu) - PRIORIDAD MÁXIMA\n\n'
      + '#### Fuentes de Backlinks Chinos:\n\n'
      + this.getChineseBacklinkSources().map(source => 
        `**${source.platform}** (Prioridad: ${source.priority})\n`
        + `- Impacto: ${source.estimatedImpact}\n`
        + `- Dificultad: ${source.difficulty}\n`
        + `- Costo: ${source.cost}\n`
        + `- Estrategia: ${source.strategy}\n\n`
      ).join('')
      + '### 🇹🇼 Taiwán y 🇭🇰 Hong Kong (Google) - PRIORIDAD ALTA\n\n'
      + '#### Fuentes de Backlinks Taiwán/Hong Kong:\n\n'
      + this.getTaiwanHongKongBacklinkSources().map(source =>
        `**${source.platform}** (${source.country})\n`
        + `- Impacto: ${source.estimatedImpact}\n`
        + `- Dificultad: ${source.difficulty}\n`
        + `- Estrategia: ${source.strategy}\n\n`
      ).join('')
      + '### 🌏 Sureste Asiático (Google) - PRIORIDAD MEDIA\n\n'
      + '#### Fuentes de Backlinks Sureste Asiático:\n\n'
      + this.getSoutheastAsiaBacklinkSources().map(source =>
        `**${source.platform}** (${source.country})\n`
        + `- Impacto: ${source.estimatedImpact}\n`
        + `- Dificultad: ${source.difficulty}\n`
        + `- Estrategia: ${source.strategy}\n\n`
      ).join('')
      + '## Cronograma de Implementación de Backlinks\n\n'
      + '### Fase 1: China (Baidu) - PRIORIDAD MÁXIMA\n'
      + '1. Crear cuenta en WeChat (semana 1)\n'
      + '2. Establecer presencia en Weibo (semana 1)\n'
      + '3. Participar en Baidu Tieba (semana 2)\n'
      + '4. Crear contenido en Xiaohongshu (semana 2)\n'
      + '5. Establecer presencia en Zhihu (semana 3)\n'
      + '6. Crear canal en Bilibili (semana 4)\n\n'
      + '### Fase 2: Taiwán/Hong Kong (Google) - PRIORIDAD ALTA\n'
      + '1. Establecer presencia en PTT (semana 2)\n'
      + '2. Crear cuenta en Dcard (semana 3)\n'
      + '3. Participar en Hong Kong Golden Forum (semana 4)\n'
      + '4. Contribuir en Uwants (semana 4)\n\n'
      + '### Fase 3: Sureste Asiático (Google) - PRIORIDAD MEDIA\n'
      + '1. Establecer presencia en Pantip (semana 3)\n'
      + '2. Participar en Kaskus (semana 4)\n'
      + '3. Contribuir en LowEndTalk (semana 5)\n'
      + '4. Participar en Lowyat.net (semana 5)\n'
      + '5. Establecer presencia en SGClub (semana 6)\n\n'
      + '## Recomendaciones de Contenido\n\n'
      + '### Para China (zh-CN):\n'
      + '- **CRÍTICO**: Versión completa en chino simplificado\n'
      + '- Adaptación cultural para mainland China\n'
      + '- Evitar temas políticos sensibles\n'
      + '- Enfocarse en naturaleza y cultura\n\n'
      + '### Para Taiwán/Hong Kong (zh-TW/zh-HK):\n'
      + '- Versión parcial en chino tradicional\n'
      + '- Enfoque en calidad y premium\n'
      + '- Adaptación estilos taiwanés/hongkonés\n\n'
      + '### Para Sureste Asiático:\n'
      + '- Meta tags en idiomas locales\n'
      + '- Keywords en idiomas locales\n'
      + '- Respeto cultural y religioso\n'
      + '- Adaptación de estilos de comunicación\n\n'
      + '## Métricas de Éxito\n\n'
      + '- **Mes 1**: Establecer presencia en 3 plataformas chinas\n'
      + '- **Mes 3**: 10+ backlinks desde sitios chinos\n'
      + '- **Mes 6**: 25+ backlinks internacionales totales\n'
      + '- **Mes 12**: 50+ backlinks internacionales\n\n'
      + '## Notas Importantes\n\n'
      + '- **No borrar contenido existente**, solo enriquecer\n'
      + '- **Mantener versión español** como base\n'
      + '- **Priorizar China** para indexación Baidu\n'
      + '- **Google domina** fuera de mainland China\n'
      + '- **Backlinks pasivos** más efectivos que activos\n'
      + '- **Calidad sobre cantidad** en backlinks\n'
  }

  /**
   * Obtener estadísticas de estrategia de backlinks
   */
  getBacklinkStrategyStats(): {
    totalSources: number
    highPrioritySources: number
    chinaSources: number
    taiwanHongKongSources: number
    southeastAsiaSources: number
    freeSources: number
    paidSources: number
  } {
    const chinaSources = this.getChineseBacklinkSources()
    const taiwanHongKongSources = this.getTaiwanHongKongBacklinkSources()
    const southeastAsiaSources = this.getSoutheastAsiaBacklinkSources()
    const allSources = [...chinaSources, ...taiwanHongKongSources, ...southeastAsiaSources]

    return {
      totalSources: allSources.length,
      highPrioritySources: allSources.filter(s => s.priority === 'high').length,
      chinaSources: chinaSources.length,
      taiwanHongKongSources: taiwanHongKongSources.length,
      southeastAsiaSources: southeastAsiaSources.length,
      freeSources: allSources.filter(s => s.cost.includes('Gratuito')).length,
      paidSources: allSources.filter(s => !s.cost.includes('Gratuito')).length
    }
  }
}

export default new BacklinkStrategyService()