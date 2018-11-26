const moment = require('moment')
const {
  Appointment,
  User
} = require('../models')

const {
  Op
} = require('sequelize')

class ScheduleController {
  async index (req, res) {
    const date = moment(parseInt(req.query.date))
    const appointments = await Appointment.findAll({
      include: [{
        model: User,
        as: 'user'
      }],
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      }
    })
    //  console.log(appointments)
    const schedules = appointments.map(appointment => {
      const hour = moment(appointment.date).format('HH:mm')
      const client = appointment.user.name
      const avatar = appointment.user.avatar
      const available = Date.parse(appointment.date) < Date.parse(new Date())

      return {
        hour,
        client,
        avatar,
        available
      }
    })
    return res.render('schedule/list', {
      schedules
    })
  }
}

module.exports = new ScheduleController()
