enum ReceiptStatus { paid, next, upcoming }

class Receipt {
  const Receipt({
    required this.number,
    required this.from,
    required this.to,
    required this.amount,
    this.paidOn,
    this.paymentMethod,
    this.uuid,
    this.folio,
  });

  final int number;
  final DateTime from;
  final DateTime to;
  final double amount;
  final DateTime? paidOn;
  final String? paymentMethod;

  /// UUID of the CFDI "complemento de pago".
  final String? uuid;
  final String? folio;

  bool get isPaid => paidOn != null;

  /// Days between the payment and the end of the period it covers.
  int? get daysBeforePeriodEnd => paidOn == null ? null : to.difference(paidOn!).inDays;
}

class Policy {
  const Policy({
    required this.number,
    required this.paymentFrequency,
    required this.people,
    required this.start,
    required this.end,
    required this.cutoff,
    required this.receipts,
  });

  final String number;
  final String paymentFrequency;
  final List<String> people;
  final DateTime start;
  final DateTime end;
  final DateTime cutoff;
  final List<Receipt> receipts;

  double get annualTotal => receipts.fold(0, (sum, r) => sum + r.amount);
  double get paidTotal => receipts.where((r) => r.isPaid).fold(0, (sum, r) => sum + r.amount);
  double get balance => annualTotal - paidTotal;
  int get paidCount => receipts.where((r) => r.isPaid).length;

  Receipt? get nextDue {
    for (final r in receipts) {
      if (!r.isPaid) return r;
    }
    return null;
  }

  ReceiptStatus statusOf(Receipt r) {
    if (r.isPaid) return ReceiptStatus.paid;
    return identical(r, nextDue) ? ReceiptStatus.next : ReceiptStatus.upcoming;
  }
}
