
db.alerts.find({active: true}).forEach(function(item) {
  print(item._id + "\t" + item.email + "\t" +
    item.code + "\t" + item.name)
})
