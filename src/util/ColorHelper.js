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
            admin: '#ED1E79',
            customer: '#FFB04C',
            primary: '#ED1E79',
            secondary: '#FFB04C',
            solidgrey: ' #828282',
            accent: '#8792E4',
            error: '#FF5252',
            warning: '#FFC107',
            info: '#2196F3',
            success: '#4CAF50',
            light: '#F5F5F5',
            dark: '#212121',
            statusNew: '#8792E4',
            statusApproved: '#5867DD',
            New: '#8792E4',
            'Pending Processing': '#2196F3',
            Processed: '#ED1E79',
            'Pending Delivery': '#5867DD',
            Delivered: '#5867DD',
            Cancelled: '#FF5252',
            'In Transit': '#5867DD',
          }[type];
        }
  }
  
  export default new ColorHelper();