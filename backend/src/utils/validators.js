function validateCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  if (cnpj.length !== 14) return false;
  
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  let soma = 0;
  let peso = 5;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpj[i]) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  
  let digito1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (parseInt(cnpj[12]) !== digito1) return false;
  
  soma = 0;
  peso = 6;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpj[i]) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  
  let digito2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return parseInt(cnpj[13]) === digito2;
}

function validateCompanyName(name) {
  const regex = /^[a-zA-ZÀ-ÿ0-9\s\-\.\,\'()]+$/;
  return regex.test(name) && name.trim().length > 0;
}

module.exports = {
  validateCNPJ,
  validateCompanyName
};