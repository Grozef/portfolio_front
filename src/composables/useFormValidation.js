import { ref } from 'vue'

export const useFormValidation = () => {
  const fieldErrors = ref({})

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'name':
        if (!value || value.trim().length < 2) {
          fieldErrors.value.name = 'Name must be at least 2 characters'
          return false
        }
        if (value.length > 100) {
          fieldErrors.value.name = 'Name must not exceed 100 characters'
          return false
        }
        delete fieldErrors.value.name
        return true

      case 'email':
        if (!value || !emailRegex.test(value)) {
          fieldErrors.value.email = 'Please enter a valid email address'
          return false
        }
        if (value.length > 150) {
          fieldErrors.value.email = 'Email must not exceed 150 characters'
          return false
        }
        delete fieldErrors.value.email
        return true

      case 'subject':
        if (!value || value.trim().length < 3) {
          fieldErrors.value.subject = 'Subject must be at least 3 characters'
          return false
        }
        if (value.length > 200) {
          fieldErrors.value.subject = 'Subject must not exceed 200 characters'
          return false
        }
        delete fieldErrors.value.subject
        return true

      case 'message':
        if (!value || value.trim().length < 10) {
          fieldErrors.value.message = 'Message must be at least 10 characters'
          return false
        }
        if (value.length > 2000) {
          fieldErrors.value.message = 'Message must not exceed 2000 characters'
          return false
        }
        delete fieldErrors.value.message
        return true

      default:
        return true
    }
  }

  const validateForm = (formData) => {
    const errors = {}

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    } else if (formData.name.length > 100) {
      errors.name = 'Name must not exceed 100 characters'
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    } else if (formData.email.length > 150) {
      errors.email = 'Email must not exceed 150 characters'
    }

    if (!formData.subject || formData.subject.trim().length < 3) {
      errors.subject = 'Subject must be at least 3 characters'
    } else if (formData.subject.length > 200) {
      errors.subject = 'Subject must not exceed 200 characters'
    }

    if (!formData.message || formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters'
    } else if (formData.message.length > 2000) {
      errors.message = 'Message must not exceed 2000 characters'
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