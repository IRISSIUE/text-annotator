// Factory to create a data provider (excel, google, or mock for now)
class DataService {
  constructor(provider) {
    this.provider = provider;
  }

  async getProjectData() {
    const [metadata, lines, annotations, styles] = await Promise.all([
      this.provider.getMetadata(),
      this.provider.getLines(),
      this.provider.getAnnotations(),
      this.provider.getStyles(),
    ]);

    return { metadata, lines, annotations, styles };
  }
}

// Mock Provider for demonstration (can be replaced with Excel or Google Sheets provider)
const MockDataProvider = {
  async getMetadata() {
    return {
      title: "The New Colossus",
      author: "Emma Lazarus",
      annotator: "Esther Schor",
    };
  },
  async getLines() {
    return [
      { id: 1, text: "Not like the [brazen-giant] of [greek-fame]," },
      { id: 2, text: "With [conquering-limbs] from [land-to-land];" },
      { id: 3, text: "Here at our sea-washed, sunset gates shall stand" },
      { id: 4, text: "A mighty woman with a [torch], whose flame" },
    ];
  },

  async getAnnotations() {
    return [
      {
        id: "brazen-giant",
        title: "About Annotators",
        content:
          "An annotator is a tool or element used to provide additional information...",
        mediaUrl: "Colossus-of-Rhodes.jpg",
        mediaPosition: "float-left",
        styleId: "giant-bold-theme",
      },
      {
        id: "greek-fame",
        title: "Greek Mythology",
        content: "Emma Lazarus had no time for Greek sun-gods...",
        mediaUrl: "",
        mediaPosition: "",
        styleId: "large-compressed-uppercase-theme",
      },
      {
        id: "conquering-limbs",
        title: "James Merrill",
        content: "The poet James Merrill once told me he pictured...",
        mediaUrl: "",
        mediaPosition: "",
        styleId: "bold-stretched-uppercase-theme",
      },
      {
        id: "land-to-land",
        title: "Emma's Travels",
        content: "Emma Lazarus first crossed the Atlantic in her thirties...",
        mediaUrl: "Emma-Lazarus.jpg",
        mediaPosition: "float-right",
        styleId: "thin-slant-uppercase-theme",
      },
      {
        id: "torch",
        title: "The Torch",
        content: "He picked an odd moment to let me know he had gone...",
        mediaUrl: "https://www.youtube.com/embed/f_rgmqnQYYo",
        mediaPosition: "video-float-left",
        styleId: "thick-lower-theme",
      },
    ];
  },

  async getStyles() {
    return [
      {
        id: "giant-bold-theme",
        fontFamily: "Verdana",
        fontSize: "2rem",
        fontStyle: "normal",
        fontWeight: "1000",
        letterSpacing: "normal",
        fontStretch: "normal",
        textTransform: "uppercase",
        color: "inherit",
        activeColor: "#93871e",
      },
      {
        id: "large-compressed-uppercase-theme",
        fontFamily: "Verdana",
        fontSize: "1.5rem",
        fontStyle: "normal",
        fontWeight: "500",
        letterSpacing: "-1.5px",
        fontStretch: "condensed",
        textTransform: "uppercase",
        color: "inherit",
        activeColor: "#1565c0",
      },
    ];
  },
};

window.DataService = DataService;
window.MockDataProvider = MockDataProvider;
