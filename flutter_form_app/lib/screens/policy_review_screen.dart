import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/policy_model.dart';
import '../models/sample_policy.dart';
import '../widgets/policy_summary_card.dart';
import '../widgets/receipt_table_widget.dart';
import '../widgets/receipt_mobile_card.dart';
import '../widgets/receipt_detail_bottom_sheet.dart';

/// Below this width receipts show as cards instead of the 10-column table.
const _compactBreakpoint = 760.0;

const _navy = Color(0xFF1B365D);

/// The light, navy look the component was designed with. Applied to this
/// screen only, so the rest of the app keeps its dark theme.
ThemeData policyReviewTheme() => ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: _navy,
        primary: _navy,
        secondary: const Color(0xFF0D6EFD),
        surface: const Color(0xFFF8FAFC),
      ),
      scaffoldBackgroundColor: const Color(0xFFF1F5F9),
      cardTheme: CardThemeData(
        elevation: 0,
        color: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: Color(0xFFE2E8F0)),
        ),
      ),
    );

class PolicyReviewScreen extends StatefulWidget {
  const PolicyReviewScreen({super.key, this.initialPolicy, this.today});

  final PolicyData? initialPolicy;

  /// Date used when registering a payment; defaults to the current day.
  final DateTime? today;

  @override
  State<PolicyReviewScreen> createState() => _PolicyReviewScreenState();
}

class _PolicyReviewScreenState extends State<PolicyReviewScreen> {
  late PolicyData _policy = widget.initialPolicy ?? samplePolicyData();

  DateTime get _today {
    final now = widget.today ?? DateTime.now();
    return DateTime.utc(now.year, now.month, now.day);
  }

  void _openReceipt(BuildContext themedContext, ReceiptItem receipt) {
    showReceiptDetailSheet(
      themedContext,
      receipt,
      status: _policy.statusOf(receipt),
      onPaymentRegistered: () => _registerPayment(receipt),
    );
  }

  void _registerPayment(ReceiptItem receipt) {
    final paid = receipt.markPaid(on: _today);
    setState(() => _policy = _policy.withReceipt(paid));
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text('Recibo ${receipt.reciboNumber} registrado como pagado el ${paid.fechaPagoText}')));
  }

  Future<void> _copySummary() async {
    final p = _policy;
    final lines = [
      'Póliza ${p.polizaId} · ${p.formaPago}',
      'Titular: ${p.titular}',
      'Vigencia: ${p.inicioVigenciaText} al ${p.finVigenciaText} · Corte: ${p.fechaCorteText}',
      'Total anual: ${p.formattedTotalAnual} · Pagado: ${p.formattedTotalPagado} · Por pagar: ${p.formattedSaldoPendiente}',
      '',
      for (final r in p.recibos)
        'Recibo ${r.reciboNumber}: ${r.vigenciaDelText} - ${r.vigenciaAlText} · ${r.formattedAmount} · '
            '${p.statusOf(r).label}${r.isPaid ? ' (${r.fechaPagoText})' : ''}',
    ];
    await Clipboard.setData(ClipboardData(text: lines.join('\n')));
    if (!mounted) return;
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(const SnackBar(content: Text('Resumen de la póliza copiado al portapapeles')));
  }

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: policyReviewTheme(),
      // Builder so the sheet, snackbars and widgets below read the screen theme.
      child: Builder(builder: _buildScaffold),
    );
  }

  Widget _buildScaffold(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Revisión de Póliza'),
        backgroundColor: _navy,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.copy_all_outlined),
            tooltip: 'Copiar resumen',
            onPressed: _copySummary,
          ),
        ],
      ),
      body: LayoutBuilder(builder: (context, box) {
        final compact = box.maxWidth < _compactBreakpoint;
        return Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1240),
            child: ListView(
              padding: EdgeInsets.all(compact ? 16 : 24),
              children: [
                PolicySummaryCard(policy: _policy),
                const SizedBox(height: 16),
                if (compact)
                  for (final r in _policy.recibos)
                    ReceiptMobileCard(
                      receipt: r,
                      status: _policy.statusOf(r),
                      totalReceipts: _policy.recibos.length,
                      onTap: () => _openReceipt(context, r),
                    )
                else
                  ReceiptTableWidget(policy: _policy, onReceiptTap: (r) => _openReceipt(context, r)),
              ],
            ),
          ),
        );
      }),
    );
  }
}
