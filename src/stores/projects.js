import { defineStore } from 'pinia'

export const useProjectStore = defineStore('projects', {
  state: () => ({
    customizations: {
      // Add your curated projects here:
      // "repository-name": {
      //   image: "/images/project-screenshot.jpg",
      //   customDesc: "Custom description overriding GitHub description",
      //   tags: ["Vue", "API", "Design"],
      //   problem: "Users needed a faster way to visualize data",
      //   solution: "Built real-time dashboard with WebSocket integration",
      //   role: "Full-stack developer & UX designer",
      //   outcomes: "50% faster data access, 10k+ daily users"
      // },
      // "another-repo": {
      //   image: "/images/another-screenshot.jpg",
      //   customDesc: "Another project description",
      //   tags: ["React", "Node.js"],
      //   problem: "Manual processes took too long",
      //   solution: "Automated workflow with CI/CD pipeline",
      //   role: "DevOps engineer",
      //   outcomes: "90% reduction in deployment time"
      // }
    }
  }),

  getters: {
    getCustomization: (state) => (repoName) => {
      return state.customizations[repoName] || null
    },

    hasCustomization: (state) => (repoName) => {
      return !!state.customizations[repoName]
    }
  }
})