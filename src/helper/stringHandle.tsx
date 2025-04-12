export const maskEmail = (email : string)=> {
    if (!email || email.length < 3) {
      return email; // 短すぎる場合はそのまま返す
    }
    const visiblePart = email.slice(0, 3);
    const maskedLength = email.length - 3;
    const maskedPart = '*'.repeat(maskedLength);
    return visiblePart + maskedPart;
}