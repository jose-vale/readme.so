const useParseImport = () => {
  const parse = (content, originalTemplate) => {
    try {
      const lines = content.split('\n')

      const isNewSection = () =>
        (lines[0] === '' && lines[1].startsWith('## ')) || lines[0].startsWith('## ')

      const isSectionTitle = (line) => line.startsWith('## ')

      const isGithubProfileIntro = (line) => line.startsWith('# Hi, ')

      const parseSection = (sectionTitle, newSection) => {
        if (!sectionTitle) {
          return null
        }

        const templateTitle = originalTemplate.find((s) => s.name === sectionTitle.substring(3))

        if (isGithubProfileIntro(sectionTitle)) {
          const originalSection = originalTemplate.find((s) => s.slug === 'github-profile-intro')

          return {
            ...originalSection,
            markdown: newSection.join('\n'),
          }
        } else if (!templateTitle) {
          return {
            slug: sectionTitle.replace('#', '').replace(' ', '-'),
            name: sectionTitle.replace('#', ''),
            markdown: newSection.join('\n'),
          }
        } else {
          const originalSection = originalTemplate.find((s) => s.name === sectionTitle.substring(3))

          return {
            ...originalSection,
            markdown: newSection.join('\n'),
          }
        }
      }

      // Extract title section
      const extractedTitle = []
      const titleSection = originalTemplate.find((s) => s.slug === 'title-and-description')
      while (true) {
        if (!lines.length || isNewSection()) {
          titleSection.markdown = extractedTitle.join('\n')
          break
        }

        extractedTitle.push(lines[0])
        lines.shift()
        continue
      }

      const remainingSections = []
      const sectionLines = []
      let tempTitle
      while (lines.length) {
        sectionLines.push(lines[0])
        const currentLine = lines[0]
        lines.shift()

        if (!tempTitle && (isGithubProfileIntro(currentLine) || isSectionTitle(currentLine))) {
          tempTitle = currentLine
        }

        if (
          currentLine !== tempTitle &&
          (isGithubProfileIntro(currentLine) || isSectionTitle(currentLine))
        ) {
          console.log(tempTitle)
          const sectionTitle = sectionLines.find(
            (e) => e.startsWith('## ') || e.startsWith('# Hi, ')
          )
          const section = parseSection(sectionTitle, sectionLines)

          if (section) {
            remainingSections.push(section)
            sectionLines.length = 0
          }

          sectionLines.length = 0
          tempTitle = null
        }
      }

      const newSections = [titleSection, ...remainingSections]
      console.log(newSections)
    } catch (error) {
      console.log('Error parsing file: ', error)
    }
  }

  return { parse }
}

export default useParseImport
