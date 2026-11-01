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

// The app's dark slate palette, shared with the registration form and the PO mockup.
const _slateBackground = Color(0xFF0F172A);
const _slateSurface = Color(0xFF1E293B);
const _slateBorder = Color(0xFF334155);
const _indigo = Color(0xFF4F46E5);

/// Matches the rest of the app: slate surfaces, indigo accent, light text and
/// the same muted gray the form uses for labels.
ThemeData policyReviewTheme() => ThemeData(
  useMaterial3: true,
  brightness: Brightness.dark,
  colorScheme: const ColorScheme.dark(
    primary: _indigo,
    onPrimary: Colors.white,
    primaryContainer: Color(0xFF312E81),
    onPrimaryContainer: Color(0xFFC7D2FE),
    secondaryContainer: _slateBorder,
    onSecondaryContainer: Color(0xFFCBD5E1),
    surface: _slateSurface,
    onSurface: Color(0xFFF1F5F9),
    onSurfaceVariant: Color(0xFF94A3B8),
    outline: _slateBorder,
    outlineVariant: _slateBorder,
  ),
  scaffoldBackgroundColor: _slateBackground,
  dividerTheme: const DividerThemeData(color: _slateBorder, space: 1),
  cardTheme: CardThemeData(
    elevation: 0,
    color: _slateSurface,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
      side: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
    ),
  ),
  bottomSheetTheme: const BottomSheetThemeData(backgroundColor: _slateSurface),
  snackBarTheme: const SnackBarThemeData(
    backgroundColor: _slateBorder,
    contentTextStyle: TextStyle(color: Colors.white),
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
      ..showSnackBar(
        SnackBar(content: Text('Recibo ${receipt.reciboNumber} registrado como pagado el ${paid.fechaPagoText}')),
      );
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
        backgroundColor: _slateSurface,
        foregroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.copy_all_outlined), tooltip: 'Copiar resumen', onPressed: _copySummary),
        ],
      ),
      body: LayoutBuilder(
        builder: (context, box) {
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
        },
      ),
    );
  }
}
