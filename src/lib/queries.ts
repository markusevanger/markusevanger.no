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
    logoImage
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
      demoUrl,
      githubUrl,
      buttonText_en,
      buttonText_no,
      order
    } | order(order asc),
    smallProjects[]-> {
      _id,
      title_en,
      title_no,
      subtitle_en,
      subtitle_no,
      externalUrl,
      githubUrl,
      order
    } | order(order asc),
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
      demoUrl,
      githubUrl,
      "reportUrl": reportDocument.asset->url,
      order
    } | order(order asc),
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
        demoUrl,
        githubUrl
      },
      order
    } | order(order asc),
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
      "certificateUrl": certificate.asset->url,
      certificateLabel_en,
      certificateLabel_no,
      order
    } | order(order asc),
    skillCategories[]-> {
      _id,
      name_en,
      name_no,
      skills[]-> {
        _id,
        name,
        url,
        icon
      },
      order
    } | order(order asc),
    contactText_en,
    contactText_no
  }
`)
