const telValidator = (value: string)=>{
    if(!value || typeof value !== 'string') return true
    return /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(value)
}

export default telValidator