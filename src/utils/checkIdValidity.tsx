export function checkIdValidity(id: string, message: string) {
  if (!id || id.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(id))
    return (
      <div className="text-center p-8 text-gray-600">Invalid {message}.</div>
    );
}
