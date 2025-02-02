enum OrderType {
  JasaTitip = "jasa-titip",
  AntarJemput = "antar-jemput",
}

enum OrderStatus {
  Waiting = "waiting",
  Accepted = "accepted",
  OnProgress = "on-progress",
  Done = "done",
  Cancelled = "cancelled",
}

const Order = {
  type: OrderType,
  status: OrderStatus,
};

const orderStatusMessages = new Map<OrderStatus, string>([
  [OrderStatus.Waiting, "Order is waiting"],
  [OrderStatus.Accepted, "Order accepted"],
  [OrderStatus.OnProgress, "Order is in progress"],
  [OrderStatus.Done, "Order completed"],
  [OrderStatus.Cancelled, "Order cancelled"],
]);

const orderTypeMessages = new Map<OrderType, string>([
  [OrderType.JasaTitip, "Jasa Titip"],
  [OrderType.AntarJemput, "Antar Jemput"],
]);

export { Order, orderStatusMessages, orderTypeMessages };
