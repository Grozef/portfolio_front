import { ref } from 'vue'

export const useFormValidation = () => {
  const fieldErrors = ref({})

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const RULES = {
    name: (v) => {
      if (!v || v.trim().length < 2) return 'Name must be at least 2 characters'
      if (v.length > 100) return 'Name must not exceed 100 characters'
      return null
    },
    email: (v) => {
      if (!v || !emailRegex.test(v)) return 'Please enter a valid email address'
      if (v.length > 150) return 'Email must not exceed 150 characters'
      return null
    },
    subject: (v) => {
      if (!v || v.trim().length < 3) return 'Subject must be at least 3 characters'
      if (v.length > 200) return 'Subject must not exceed 200 characters'
      return null
    },
    message: (v) => {
      if (!v || v.trim().length < 10) return 'Message must be at least 10 characters'
      if (v.length > 2000) return 'Message must not exceed 2000 characters'
      return null
    }
  }

  const validateField = (fieldName, value) => {
    const rule = RULES[fieldName]
    if (!rule) return true
    const error = rule(value)
    if (error) {
      fieldErrors.value[fieldName] = error
      return false
    }
    delete fieldErrors.value[fieldName]
    return true
  }

  const validateForm = (formData) => {
    const errors = {}
    for (const [field, rule] of Object.entries(RULES)) {
      const error = rule(formData[field])
      if (error) errors[field] = error
    }
    return errors
  }

  const clearErrors = () => {
    fieldErrors.value = {}
  }

  return {
    fieldErrors,
    validateField,
    validateForm,
    clearErrors
  }
}
