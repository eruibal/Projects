import 'package:flutter/material.dart';

import 'data.dart';
import 'format.dart';
import 'models.dart';
import 'poliza_theme.dart';
import 'widgets/policy_header.dart';
import 'widgets/receipts_table.dart';

/// Below this width the header stacks and the table scrolls sideways.
const compactBreakpoint = 760.0;

/// Entry point from the rest of the app. Uses the tracker's own dark theme
/// so its navy header and status colors read the same as the prototype.
class PolicyPaymentsScreen extends StatelessWidget {
  const PolicyPaymentsScreen({super.key, this.policy});

  final Policy? policy;

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: buildTheme(Brightness.dark),
      child: PolicyPage(policy: policy ?? samplePolicy),
    );
  }
}

enum ReceiptFilter { all, paid, pending }

class PolicyPage extends StatefulWidget {
  const PolicyPage({super.key, required this.policy});
  final Policy policy;

  @override
  State<PolicyPage> createState() => _PolicyPageState();
}

class _PolicyPageState extends State<PolicyPage> {
  ReceiptFilter _filter = ReceiptFilter.all;

  List<Receipt> get _visible => switch (_filter) {
        ReceiptFilter.all => widget.policy.receipts,
        ReceiptFilter.paid => widget.policy.receipts.where((r) => r.isPaid).toList(),
        ReceiptFilter.pending => widget.policy.receipts.where((r) => !r.isPaid).toList(),
      };

  @override
  Widget build(BuildContext context) {
    final policy = widget.policy;
    return Scaffold(
      appBar: AppBar(
        title: Text('Póliza ${policy.number}'),
        backgroundColor: navy,
        foregroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
      ),
      body: LayoutBuilder(builder: (context, box) {
        final compact = box.maxWidth < compactBreakpoint;
        final gutter = compact ? 16.0 : 32.0;
        final tableScrolls = compact || box.maxWidth - gutter * 2 < ReceiptsTable.naturalWidthFor(compact: false);

        return SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              PolicyHeader(policy: policy, compact: compact),
              Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 1240),
                  child: SafeArea(
                    top: false,
                    child: Padding(
                      padding: EdgeInsets.fromLTRB(gutter, 24, gutter, 48),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          if (policy.nextDue case final next?) ...[
                            _NextPaymentBanner(receipt: next),
                            const SizedBox(height: 20),
                          ],
                          Wrap(
                            alignment: WrapAlignment.spaceBetween,
                            crossAxisAlignment: WrapCrossAlignment.center,
                            spacing: 12,
                            runSpacing: 12,
                            children: [
                              Text('Recibos', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w600)),
                              SegmentedButton<ReceiptFilter>(
                                showSelectedIcon: false,
                                segments: const [
                                  ButtonSegment(value: ReceiptFilter.all, label: Text('Todos')),
                                  ButtonSegment(value: ReceiptFilter.paid, label: Text('Pagados')),
                                  ButtonSegment(value: ReceiptFilter.pending, label: Text('Pendientes')),
                                ],
                                selected: {_filter},
                                onSelectionChanged: (s) => setState(() => _filter = s.first),
                              ),
                            ],
                          ),
                          if (tableScrolls) ...[
                            const SizedBox(height: 8),
                            Text('Desliza la tabla para ver fecha, forma de pago y complemento.',
                                style: TextStyle(fontSize: 12, color: Theme.of(context).colorScheme.onSurfaceVariant)),
                          ],
                          const SizedBox(height: 12),
                          ReceiptsTable(policy: policy, receipts: _visible, compact: compact),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      }),
    );
  }
}

class _NextPaymentBanner extends StatelessWidget {
  const _NextPaymentBanner({required this.receipt});
  final Receipt receipt;

  @override
  Widget build(BuildContext context) {
    final s = statusStyle(ReceiptStatus.next, Theme.of(context).brightness);
    final onSurface = Theme.of(context).colorScheme.onSurface;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
      decoration: BoxDecoration(color: s.bg, borderRadius: BorderRadius.circular(10)),
      child: Wrap(
        alignment: WrapAlignment.spaceBetween,
        spacing: 24,
        runSpacing: 6,
        children: [
          Text.rich(TextSpan(style: TextStyle(color: onSurface), children: [
            TextSpan(text: 'Siguiente pago: recibo ${receipt.number}', style: const TextStyle(fontWeight: FontWeight.w600)),
            TextSpan(text: ' · periodo ${formatDate(receipt.from)} → ${formatDate(receipt.to)}'),
          ])),
          Text.rich(TextSpan(style: TextStyle(color: onSurface, fontFeatures: tabular), children: [
            TextSpan(text: formatMxn(receipt.amount), style: const TextStyle(fontWeight: FontWeight.w600)),
            const TextSpan(text: ' · '),
            TextSpan(text: 'pagar antes del ${formatDate(receipt.to)}', style: TextStyle(color: s.fg, fontWeight: FontWeight.w600)),
          ])),
        ],
      ),
    );
  }
}
