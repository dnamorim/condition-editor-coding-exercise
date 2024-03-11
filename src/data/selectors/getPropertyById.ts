const getPropertyById = (propertyId: string) =>
  window.datastore
    .getProperties()
    .find(
      (property) => propertyId !== '' && property.id === Number(propertyId),
    );

export default getPropertyById;
