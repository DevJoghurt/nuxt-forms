export type I18nLocales = 'en' | 'de' | 'es' | 'fr' | 'it'

export type LocaleTypes = {
    required?: string,
    is_true?: string,
    password_length?: string,
    password_uppercase?: string,
    password_lowercase?: string,
    password_number?: string,
    password_special?: string,
    email_invalid?: string,
    [key: string]: string
}

export type Locales = Record <I18nLocales, LocaleTypes>

const defaultLocales: Locales = {
  en: {
    required: 'This field is required',
    is_true: 'This field must be checked',
    tel_invalid: 'This field must be a valid phone number',
    password_length: 'Password must be at least 8 characters long',
    password_uppercase: 'Password must contain at least one uppercase letter',
    password_lowercase: 'Password must contain at least one lowercase letter',
    password_number: 'Password must contain at least one number',
    password_special: 'Password must contain at least one special character',
    email_invalid: 'Email is invalid'
  },
  de: {
    required: 'Dieses Feld ist erforderlich',
    is_true: 'Dieses Feld muss angekreuzt werden',
    tel_invalid: 'Dieses Feld muss eine gültige Telefonnummer sein',
    password_length: 'Das Passwort muss mindestens 8 Zeichen lang sein',
    password_uppercase: 'Das Passwort muss mindestens einen Großbuchstaben enthalten',
    password_lowercase: 'Das Passwort muss mindestens einen Kleinbuchstaben enthalten',
    password_number: 'Das Passwort muss mindestens eine Zahl enthalten',
    password_special: 'Das Passwort muss mindestens ein Sonderzeichen enthalten',
    email_invalid: 'E-Mail ist ungültig'
  },
  es: {
    required: 'Este campo es obligatorio',
    is_true: 'Este campo debe estar marcado',
    tel_invalid: 'Este campo debe ser un número de teléfono válido',
    password_length: 'La contraseña debe tener al menos 8 caracteres',
    password_uppercase: 'La contraseña debe contener al menos una letra mayúscula',
    password_lowercase: 'La contraseña debe contener al menos una letra minúscula',
    password_number: 'La contraseña debe contener al menos un número',
    password_special: 'La contraseña debe contener al menos un carácter especial',
    email_invalid: 'El correo electrónico no es válido'
  },
  fr: {
    required: 'Ce champ est requis',
    is_true: 'Ce champ doit être coché',
    tel_invalid: 'Ce champ doit être un numéro de téléphone valide',
    password_length: 'Le mot de passe doit comporter au moins 8 caractères',
    password_uppercase: 'Le mot de passe doit contenir au moins une lettre majuscule',
    password_lowercase: 'Le mot de passe doit contenir au moins une lettre minuscule',
    password_number: 'Le mot de passe doit contenir au moins un chiffre',
    password_special: 'Le mot de passe doit contenir au moins un caractère spécial',
    email_invalid: 'L\'email n\'est pas valide'
  },
  it: {
    required: 'Questo campo è obbligatorio',
    is_true: 'Questo campo deve essere selezionato',
    tel_invalid: 'Questo campo deve essere un numero di telefono valido',
    password_length: 'La password deve contenere almeno 8 caratteri',
    password_uppercase: 'La password deve contenere almeno una lettera maiuscola',
    password_lowercase: 'La password deve contenere almeno una lettera minuscola',
    password_number: 'La password deve contenere almeno un numero',
    password_special: 'La password deve contenere almeno un carattere speciale',
    email_invalid: 'L\'email non è valida'
  }
}

export function useFormLocale () {
  const formLocales = {} as LocaleTypes

  const addLocales = (newLocales: LocaleTypes) => {
    Object.assign(formLocales, newLocales)
  }

  const getLocale = (localeType: I18nLocales) => {
    const locales = {} as LocaleTypes
    Object.assign(locales, defaultLocales[localeType])
    Object.assign(locales, formLocales)
    return locales
  }

  return {
    getLocale,
    addLocales
  }
}
