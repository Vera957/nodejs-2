const express = require('express')
const contactsRouter = express.Router()
const { auth } = require('../../middlewares/auth.middleware')
const controller = require('../../models/contacts')
const { tryCatchWrapper } = require('../../middlewares/tryCatchWrapper')


contactsRouter.get('/', tryCatchWrapper(auth), tryCatchWrapper(controller.listContacts))
contactsRouter.delete('/:id', tryCatchWrapper(auth), tryCatchWrapper(controller.removeContact))
contactsRouter.post('/', tryCatchWrapper(auth), tryCatchWrapper(controller.addContact))
contactsRouter.get('/:id', tryCatchWrapper(auth), tryCatchWrapper(controller.getContactById))
contactsRouter.put('/:id', tryCatchWrapper(auth), tryCatchWrapper(controller.updateContact))
contactsRouter.patch('/favorite/:id', tryCatchWrapper(auth), tryCatchWrapper(controller.updateFavorite))

module.exports = { tryCatchWrapper, contactsRouter }

