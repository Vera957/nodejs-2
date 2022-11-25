const { Contact, schemaPost, schemaPut } = require('../routes/api/schemas.contacts')

async function listContacts(req, res, next) {
  const owner = req.user._id
  const data = await Contact.find({ owner })
  return res.json({ data: data });
}

async function getContactById(req, res, next) {
  const { id } = req.params;
  const contact = await Contact.findById(id)
  if (contact.owner._id.toString() === req.user._id.toString()) {
    return res.json({ contactToFind: contact })
  } return res.status(404).json({ message: "contact has another owner" })
}

async function removeContact(req, res, next) {
  const owner = req.user
  const { id } = req.params
  const findenContact = await Contact.findById(id)
  if (findenContact.owner.toString() === owner._id.toString()) {
    await Contact.findByIdAndDelete(id)
    return res.json({ message: `${id} deleted` })
  }
  return res.status(404).json({ message: "contact has another owner" })
}

async function addContact(req, res, next) {
  const owner = req.user._id
  const { body } = req
  const val = schemaPost.validate(body)
  const { error, value } = val;
  if (error) {
    return res.status(404).json({ message: error.message })
  } else {
    value.owner = owner
    await Contact.create(value);
    return res.json({ message: 'added successful' })
  }
}

async function updateContact(req, res, next) {
  const owner = req.user
  const { body } = req
  const { id } = req.params
  const val = schemaPut.validate(body)
  const { error, value } = val
  if (error) {
    throw new Error(error)
  } else {
    const contact = await Contact.findById(id)
    if (contact._id === owner._id) {
      const updatedContact = await Contact.findByIdAndUpdate(id, value, { new: true });
      return res.json({ message: `${updatedContact} updated successful` });
    }
    return res.status(404).json({ message: "contact has another owner" })
  }
}

async function updateFavorite(req, res, next) {
  console.log('updateFavorite', updateFavorite)
  const owner = req.user._id
  const { id } = req.params;
  const contactFinden = await Contact.findById(id)
  console.log('contactFinden', contactFinden)
 
  if (req.body.favorite === undefined) {
    return res.status(400).json({ "message": "missing field favorite" })
  } else {
    if (contactFinden.owner.toString() === owner.toString()) {
      const contact = await updateStatusContact(contactFinden, req.body)
      console.log('contact', contact)
      if (!contact) return res.status(400).json({ message: "not found" })
        return res.json({ "message": contact })
    }   
  }
}

async function updateStatusContact(contact, body) {
  contact.favorite = body.favorite
  console.log('contact', contact)
  await Contact.findByIdAndUpdate(contact._id, contact, { new: true })
    return contact
  } 

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFavorite
}

