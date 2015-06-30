
db.alerts.find({active: true}).forEach(function(item) {
  print(item._id + "\t" + item.name + "\t" +
    item.code + "\t" + item.email)
})
