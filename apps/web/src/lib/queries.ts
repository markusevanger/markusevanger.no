import { defineQuery } from 'next-sanity'

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    name,
    email,
    birthDate,
    githubUrl,
    linkedinUrl,
    profileImage,
    cvProfileImage,
    logoImage,
    contactText_en,
    contactText_no,
    madeByText_en,
    madeByText_no
  }
`)

export const frontpageQuery = defineQuery(`
  *[_type == "frontpage"][0] {
    heroTitle_en,
    heroTitle_no,
    heroDescription_en,
    heroDescription_no,
    heroButtons[] {
      text_en,
      text_no,
      link,
      "internalLink": internalLink->_type,
      linkType,
      type,
      icon,
      "downloadUrl": downloadFile.asset->url
    },
    portfolioTitle_en,
    portfolioTitle_no,
    featuredProjects[]-> {
      _id,
      title_en,
      title_no,
      subtitle_en,
      subtitle_no,
      description_en,
      description_no,
      period_en,
      period_no,
      image,
      imageAlt_en,
      imageAlt_no,
      buttons[] {
        text_en,
        text_no,
        link,
        linkType,
        type,
        icon,
        "downloadUrl": downloadFile.asset->url
      }
    },
    smallProjects[]-> {
      _id,
      title_en,
      title_no,
      subtitle_en,
      subtitle_no,
      link
    }
  }
`)

export const cvPageQuery = defineQuery(`
  *[_type == "cv"][0] {
    pageTitle_en,
    pageTitle_no,
    backButtonText_en,
    backButtonText_no,
    projectsSectionTitle_en,
    projectsSectionTitle_no,
    educationSectionTitle_en,
    educationSectionTitle_no,
    workSectionTitle_en,
    workSectionTitle_no,
    skillsSectionTitle_en,
    skillsSectionTitle_no,
    featuredProjects[]-> {
      _id,
      title_en,
      title_no,
      description_en,
      description_no,
      period_en,
      period_no,
      buttons[] {
        text_en,
        text_no,
        link,
        linkType,
        type,
        icon,
        "downloadUrl": downloadFile.asset->url
      },
      "reportUrl": reportDocument.asset->url
    },
    education[]-> {
      _id,
      institution_en,
      institution_no,
      degree_en,
      degree_no,
      location_en,
      location_no,
      description_en,
      description_no,
      period_en,
      period_no,
      buttons[] {
        text_en,
        text_no,
        link,
        linkType,
        type,
        icon,
        "downloadUrl": downloadFile.asset->url
      }
    },
    workExperience[]-> {
      _id,
      company_en,
      company_no,
      position_en,
      position_no,
      description_en,
      description_no,
      period_en,
      period_no,
      buttons[] {
        text_en,
        text_no,
        link,
        linkType,
        type,
        icon,
        "downloadUrl": downloadFile.asset->url
      }
    },
    skillCategories[]-> {
      _id,
      name_en,
      name_no,
      "skills": skills[]-> {
        _id,
        name,
        url,
        icon
      } | order(
        select(
          defined(url) => 0,
          defined(icon) => 1,
          2
        )
      )
    },
    contactText_en,
    contactText_no
  }
`)
