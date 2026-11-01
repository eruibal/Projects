const monthsShort = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

String _two(int n) => n.toString().padLeft(2, '0');

String formatDate(DateTime d) => '${_two(d.day)}/${_two(d.month)}/${d.year}';

/// Formats as Mexican pesos, e.g. 14133.23 -> $14,133.23.
String formatMxn(double value) {
  final cents = (value * 100).round();
  final whole = (cents ~/ 100).toString();
  final frac = _two(cents % 100);
  final buf = StringBuffer();
  for (var i = 0; i < whole.length; i++) {
    if (i > 0 && (whole.length - i) % 3 == 0) buf.write(',');
    buf.write(whole[i]);
  }
  return '\$$buf.$frac';
}
