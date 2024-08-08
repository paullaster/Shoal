class ColorHelper {
    createRandonColor(guide) {
      const randomColor = {};
      if (Array.isArray(guide)) {
        guide.forEach(g => {
          const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          randomColor[g] = color;
        });
      }
      return randomColor;
    }
      colorsHelper(type) {
          return {
            lead: '#5867DD',
            admin: '#FFB04C',
            primary: '#5867DD',
            secondary: '#FFB04C',
            accent: '#8792E4',
            error: '#FF5252',
            warning: '#FFC107',
            info: '#2196F3',
            success: '#4CAF50',
            light: '#F5F5F5',
            dark: '#212121',
            statusNew: '#8792E4',
            statusApproved: '#5867DD',
            genderMale: '#2196F3',
            genderFemale: '#4CAF50',
            genderIntersex: '#FFB04C',
            age20To24: '#FFC107',
            age25To29: '#8792E4',
            ageAbove30: '#FF5252',
            county047: '#4CAF50',
            county034: '#4CAF50',
            county025: '#2196F3',
            county024: '#2196F3',
            county023: '#2196F3',
            county022: '#4CAF50',
            county016: '#4CAF50',
            county010: '#2196F3',
            county009: '#2196F3',
            county008: '#2196F3',
            county007: '#2196F3',
            county005: '#2196F3',
            county004: '#2196F3',
          }[type];
        }
  }
  
  export default new ColorHelper();