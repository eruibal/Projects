import 'package:flutter/material.dart';

import '../format.dart';
import '../models.dart';
import '../poliza_theme.dart';

/// Navy band with policy facts, totals and a 12-month payment strip.
class PolicyHeader extends StatelessWidget {
  const PolicyHeader({super.key, required this.policy, required this.compact});

  final Policy policy;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    const onNavy = Colors.white;
    final muted = onNavy.withValues(alpha: 0.72);
    final text = Theme.of(context).textTheme;
    final pct = (policy.paidTotal / policy.annualTotal * 100).toStringAsFixed(1);
    final remaining = policy.receipts.length - policy.paidCount;

    final totals = [
      _Total(label: 'Total anual estimado', value: formatMxn(policy.annualTotal), sub: '${policy.receipts.length} recibos'),
      _Total(label: 'Pagado', value: formatMxn(policy.paidTotal), sub: '${policy.paidCount} de ${policy.receipts.length} recibos · $pct%'),
      _Total(label: 'Saldo por pagar', value: formatMxn(policy.balance), sub: '$remaining recibos restantes'),
    ];

    return ColoredBox(
      color: navy,
      child: SafeArea(
        bottom: false,
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1240),
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: compact ? 16 : 32, vertical: compact ? 20 : 28),
              child: DefaultTextStyle(
        style: text.bodyMedium!.copyWith(color: onNavy),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Wrap(
              spacing: 32,
              runSpacing: 16,
              alignment: WrapAlignment.spaceBetween,
              crossAxisAlignment: WrapCrossAlignment.end,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('PÓLIZA · PAGO ${policy.paymentFrequency.toUpperCase()}',
                        style: TextStyle(color: muted, fontSize: 12, letterSpacing: 1)),
                    const SizedBox(height: 4),
                    Text(policy.number,
                        style: TextStyle(fontSize: compact ? 30 : 40, fontWeight: FontWeight.w600, height: 1.05, fontFeatures: tabular)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 18,
                      runSpacing: 4,
                      children: [for (final p in policy.people) Text(p, style: TextStyle(color: onNavy.withValues(alpha: 0.9)))],
                    ),
                  ],
                ),
                Wrap(
                  spacing: 24,
                  runSpacing: 8,
                  children: [
                    _Fact('Inicio de vigencia', formatDate(policy.start)),
                    _Fact('Fin de vigencia', formatDate(policy.end)),
                    _Fact('Corte del análisis', formatDate(policy.cutoff)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 24),
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Container(
                color: onNavy.withValues(alpha: 0.18),
                child: compact
                    ? Column(
                        children: [
                          totals[0],
                          const SizedBox(height: 1),
                          IntrinsicHeight(
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [Expanded(child: totals[1]), const SizedBox(width: 1), Expanded(child: totals[2])],
                            ),
                          ),
                        ],
                      )
                    : IntrinsicHeight(
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Expanded(child: totals[0]),
                            const SizedBox(width: 1),
                            Expanded(child: totals[1]),
                            const SizedBox(width: 1),
                            Expanded(child: totals[2]),
                          ],
                        ),
                      ),
              ),
            ),
            const SizedBox(height: 20),
            _MonthStrip(policy: policy),
          ],
        ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _Fact extends StatelessWidget {
  const _Fact(this.label, this.value);
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(fontSize: 12, color: Colors.white.withValues(alpha: 0.72))),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w500, fontFeatures: tabular)),
        ],
      );
}

class _Total extends StatelessWidget {
  const _Total({required this.label, required this.value, required this.sub});
  final String label;
  final String value;
  final String sub;

  @override
  Widget build(BuildContext context) {
    final muted = Colors.white.withValues(alpha: 0.72);
    return Container(
      color: navy,
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label.toUpperCase(), style: TextStyle(fontSize: 11, letterSpacing: 0.6, color: muted)),
          const SizedBox(height: 2),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(value, style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w600, fontFeatures: tabular)),
          ),
          Text(sub, style: TextStyle(fontSize: 12, color: muted)),
        ],
      ),
    );
  }
}

class _MonthStrip extends StatelessWidget {
  const _MonthStrip({required this.policy});
  final Policy policy;

  @override
  Widget build(BuildContext context) {
    const paid = Color(0xFF4FC283);
    const next = Color(0xFFF3B45A);
    final empty = Colors.white.withValues(alpha: 0.16);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            for (final r in policy.receipts)
              Expanded(
                child: Tooltip(
                  message: 'Recibo ${r.number}: ${statusStyle(policy.statusOf(r), Brightness.dark).label}',
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 2),
                    child: Column(
                      children: [
                        Container(
                          height: 10,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(3),
                            color: switch (policy.statusOf(r)) {
                              ReceiptStatus.paid => paid,
                              ReceiptStatus.next => next,
                              ReceiptStatus.upcoming => empty,
                            },
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(monthsShort[r.from.month - 1],
                            style: TextStyle(fontSize: 11, color: Colors.white.withValues(alpha: r.isPaid ? 1 : 0.7))),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 10),
        Wrap(
          spacing: 16,
          runSpacing: 4,
          children: [
            _LegendItem(color: paid, label: 'Pagado'),
            _LegendItem(color: next, label: 'Siguiente'),
            _LegendItem(color: empty, label: 'Por vencer'),
          ],
        ),
      ],
    );
  }
}

class _LegendItem extends StatelessWidget {
  const _LegendItem({required this.color, required this.label});
  final Color color;
  final String label;

  @override
  Widget build(BuildContext context) => Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(width: 10, height: 10, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(2))),
          const SizedBox(width: 6),
          Text(label, style: TextStyle(fontSize: 12, color: Colors.white.withValues(alpha: 0.85))),
        ],
      );
}
