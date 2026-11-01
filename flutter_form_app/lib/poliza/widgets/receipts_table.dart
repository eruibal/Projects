import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../format.dart';
import '../models.dart';
import '../poliza_theme.dart';

class _Column {
  const _Column(this.title, this.width, {this.alignEnd = false});
  final String title;
  final double width;
  final bool alignEnd;
}

const _wideColumns = [
  _Column('Recibo', 76),
  _Column('Periodo', 210),
  _Column('Importe', 130, alignEnd: true),
  _Column('Estatus', 130),
  _Column('Fecha de pago', 180),
  _Column('Forma de pago', 220),
  _Column('Complemento de pago', 280),
];

// On phones the first four columns fit a 375pt screen; the rest scroll in.
const _compactColumns = [
  _Column('#', 44),
  _Column('Periodo', 96),
  _Column('Importe', 100, alignEnd: true),
  _Column('Estatus', 104),
  _Column('Fecha de pago', 160),
  _Column('Forma de pago', 200),
  _Column('Complemento de pago', 260),
];

String _shortDate(DateTime d) => '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year % 100}';

const _headerHeight = 44.0;
const _rowHeight = 60.0;
const _footerHeight = 48.0;

/// A table at every width. When the columns fit, they stretch to fill the
/// space; when they don't, the table scrolls sideways with "Recibo" pinned.
class ReceiptsTable extends StatelessWidget {
  const ReceiptsTable({super.key, required this.policy, required this.receipts, this.compact = false});

  final Policy policy;
  final List<Receipt> receipts;
  final bool compact;

  List<_Column> get _columns => compact ? _compactColumns : _wideColumns;

  static double naturalWidthFor({required bool compact}) =>
      (compact ? _compactColumns : _wideColumns).fold(0, (sum, c) => sum + c.width);

  double get naturalWidth => naturalWidthFor(compact: compact);

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return LayoutBuilder(builder: (context, box) {
      final fits = !compact && box.maxWidth >= naturalWidth;
      return Container(
        decoration: BoxDecoration(
          color: scheme.surface,
          border: Border.all(color: scheme.outlineVariant),
          borderRadius: BorderRadius.circular(10),
        ),
        clipBehavior: Clip.antiAlias,
        child: fits ? _buildStretched(context) : _buildPinned(context),
      );
    });
  }

  Widget _buildStretched(BuildContext context) {
    final all = List.generate(_columns.length, (i) => i);
    return Column(
      children: [
        _row(context, all, _headerHeight, (i) => _headerCell(context, i), stretch: true, kind: _RowKind.header),
        for (final r in receipts)
          _row(context, all, _rowHeight, (i) => _bodyCell(context, r, i), stretch: true, receipt: r),
        _row(context, all, _footerHeight, (i) => _footerCell(context, i), stretch: true, kind: _RowKind.footer),
      ],
    );
  }

  Widget _buildPinned(BuildContext context) {
    final rest = List.generate(_columns.length - 1, (i) => i + 1);
    Widget column(List<int> cols) => Column(
          children: [
            _row(context, cols, _headerHeight, (i) => _headerCell(context, i), kind: _RowKind.header),
            for (final r in receipts) _row(context, cols, _rowHeight, (i) => _bodyCell(context, r, i), receipt: r),
            _row(context, cols, _footerHeight, (i) => _footerCell(context, i), kind: _RowKind.footer),
          ],
        );

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        DecoratedBox(
          decoration: BoxDecoration(
            border: Border(right: BorderSide(color: Theme.of(context).colorScheme.outlineVariant)),
          ),
          child: SizedBox(width: _columns[0].width, child: column(const [0])),
        ),
        Expanded(
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: SizedBox(width: naturalWidth - _columns[0].width, child: column(rest)),
          ),
        ),
      ],
    );
  }

  Widget _row(
    BuildContext context,
    List<int> cols,
    double height,
    Widget Function(int) cell, {
    bool stretch = false,
    _RowKind kind = _RowKind.body,
    Receipt? receipt,
  }) {
    final scheme = Theme.of(context).colorScheme;
    final isLastBody = receipt != null && identical(receipt, receipts.last);
    final bg = switch (kind) {
      _RowKind.header => navy,
      _RowKind.footer => scheme.surfaceContainerHighest,
      _RowKind.body => scheme.surface,
    };
    return Container(
      height: height,
      decoration: BoxDecoration(
        color: bg,
        border: kind == _RowKind.body && !isLastBody
            ? Border(bottom: BorderSide(color: scheme.outlineVariant))
            : null,
      ),
      child: Row(
        children: [
          for (final i in cols)
            stretch
                ? Expanded(flex: _columns[i].width.round(), child: _pad(i, cell(i)))
                : SizedBox(width: _columns[i].width, child: _pad(i, cell(i))),
        ],
      ),
    );
  }

  Widget _pad(int i, Widget child) => Padding(
        padding: EdgeInsets.symmetric(horizontal: compact ? 8 : 12),
        child: Align(
          alignment: _columns[i].alignEnd ? Alignment.centerRight : Alignment.centerLeft,
          child: child,
        ),
      );

  Widget _headerCell(BuildContext context, int i) => Text(
        _columns[i].title,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
      );

  Widget _footerCell(BuildContext context, int i) {
    const style = TextStyle(fontWeight: FontWeight.w600, fontFeatures: tabular);
    return switch (i) {
      // The narrow "#" column on phones can't fit the word, so it moves one over.
      0 when !compact => const Text('Total', style: style),
      1 when compact => const Text('Total', style: style),
      2 => Text(formatMxn(policy.annualTotal), style: style),
      _ => const SizedBox.shrink(),
    };
  }

  Widget _bodyCell(BuildContext context, Receipt r, int i) {
    final scheme = Theme.of(context).colorScheme;
    final status = policy.statusOf(r);
    final dim = status == ReceiptStatus.upcoming;
    final base = TextStyle(
      fontSize: 14,
      fontFeatures: tabular,
      color: dim ? scheme.onSurfaceVariant : scheme.onSurface,
    );
    final small = TextStyle(fontSize: 12, color: scheme.onSurfaceVariant);

    switch (i) {
      case 0:
        return Text('${r.number}', style: base.copyWith(fontSize: 17, fontWeight: FontWeight.w600, color: scheme.onSurface));
      case 1:
        if (compact) {
          return Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(_shortDate(r.from), maxLines: 1, style: base.copyWith(fontSize: 13)),
              Text('→ ${_shortDate(r.to)}', maxLines: 1, style: base.copyWith(fontSize: 13, color: scheme.onSurfaceVariant)),
            ],
          );
        }
        return Text('${formatDate(r.from)}  →  ${formatDate(r.to)}', style: base, maxLines: 1, overflow: TextOverflow.ellipsis);
      case 2:
        return Text(formatMxn(r.amount), style: base.copyWith(fontWeight: FontWeight.w500));
      case 3:
        return StatusPill(status: status);
      case 4:
        if (!r.isPaid) return const SizedBox.shrink();
        final days = r.daysBeforePeriodEnd!;
        return Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(formatDate(r.paidOn!), style: base, maxLines: 1),
            Text('$days ${days == 1 ? 'día' : 'días'} antes${compact ? '' : ' del cierre'}',
                style: small, maxLines: 1, overflow: TextOverflow.ellipsis),
          ],
        );
      case 5:
        return Text(r.paymentMethod ?? '', style: base, maxLines: 2, overflow: TextOverflow.ellipsis);
      default:
        if (r.uuid != null) return _ProofCell(folio: r.folio!, uuid: r.uuid!);
        return Text(r.isPaid ? 'Sin complemento' : '', style: small);
    }
  }
}

enum _RowKind { header, body, footer }

class StatusPill extends StatelessWidget {
  const StatusPill({super.key, required this.status});
  final ReceiptStatus status;

  @override
  Widget build(BuildContext context) {
    final s = statusStyle(status, Theme.of(context).brightness);
    final pill = Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
      decoration: BoxDecoration(color: s.bg, borderRadius: BorderRadius.circular(999)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(width: 6, height: 6, decoration: BoxDecoration(color: s.fg, shape: BoxShape.circle)),
          const SizedBox(width: 6),
          Text(s.label, style: TextStyle(color: s.fg, fontSize: 12, fontWeight: FontWeight.w600)),
        ],
      ),
    );
    // Shrinks rather than overflows if a large text scale makes the label wider than the column.
    return FittedBox(fit: BoxFit.scaleDown, alignment: Alignment.centerLeft, child: pill);
  }
}

class _ProofCell extends StatelessWidget {
  const _ProofCell({required this.folio, required this.uuid});
  final String folio;
  final String uuid;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(folio, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 13, fontFamilyFallback: monoFamilies, color: scheme.onSurface)),
        Row(
          children: [
            Expanded(
              child: Tooltip(
                message: uuid,
                child: Text(
                  uuid,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontSize: 11.5, fontFamilyFallback: monoFamilies, color: scheme.onSurfaceVariant),
                ),
              ),
            ),
            IconButton(
              tooltip: 'Copiar UUID',
              icon: const Icon(Icons.copy_rounded, size: 15),
              visualDensity: VisualDensity.compact,
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints.tightFor(width: 28, height: 24),
              onPressed: () async {
                await Clipboard.setData(ClipboardData(text: uuid));
                if (!context.mounted) return;
                ScaffoldMessenger.of(context)
                  ..hideCurrentSnackBar()
                  ..showSnackBar(SnackBar(content: Text('UUID copiado: $uuid'), behavior: SnackBarBehavior.floating));
              },
            ),
          ],
        ),
      ],
    );
  }
}
