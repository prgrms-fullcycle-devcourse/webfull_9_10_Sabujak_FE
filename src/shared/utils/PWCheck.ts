export const handlePasswordChange = (e : string) => {
    const value = e;
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    return numericValue;
  }; 