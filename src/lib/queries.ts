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
    workplaceText_en,
    workplaceText_no,
    workplaceUrl,
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
        type,
        icon
      }
    },
    smallProjects[]-> {
      _id,
      title_en,
      title_no,
      subtitle_en,
      subtitle_no,
      link
    },
    contactText_en,
    contactText_no,
    madeByText_en,
    madeByText_no,
    copiedNotification_en,
    copiedNotification_no
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
        type,
        icon
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
      externalUrl,
      relatedProjects[]-> {
        _id,
        title_en,
        title_no,
        link
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
      companyUrl,
      buttons[] {
        text_en,
        text_no,
        link,
        type,
        icon
      }
    },
    skillCategories[]-> {
      _id,
      name_en,
      name_no,
      skills[]-> {
        _id,
        name,
        url,
        icon
      }
    },
    contactText_en,
    contactText_no
  }
`)
