import 'package:flutter/material.dart';
import 'package:flutter_form_app/models/policy_model.dart';
import 'package:flutter_form_app/models/sample_policy.dart';
import 'package:flutter_form_app/screens/policy_review_screen.dart';
import 'package:flutter_form_app/widgets/receipt_mobile_card.dart';
import 'package:flutter_test/flutter_test.dart';

Future<void> pumpAt(WidgetTester tester, Size size) async {
  tester.view.physicalSize = size;
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(MaterialApp(
    theme: ThemeData.dark(useMaterial3: true),
    home: PolicyReviewScreen(today: DateTime.utc(2026, 10, 31)),
  ));
  await tester.pumpAndSettle();
}

void main() {
  group('sample data', () {
    final policy = samplePolicyData();

    test('periods run month by month into 2027', () {
      expect(policy.recibos.first.vigenciaDelText, '05/06/2026');
      expect(policy.recibos[7].vigenciaDelText, '05/01/2027');
      expect(policy.recibos.last.vigenciaAlText, '05/06/2027');
      for (var i = 1; i < policy.recibos.length; i++) {
        expect(policy.recibos[i].vigenciaDel, policy.recibos[i - 1].vigenciaAl);
      }
    });

    test('payment details match the schedule', () {
      expect(policy.recibos.take(5).map((r) => r.diasAntesFinPeriodo), [4, 1, 4, 3, 6]);
      final fifth = policy.recibos[4];
      expect(fifth.formaPago, '04 Tarjeta de crédito');
      expect(fifth.uuidComplemento, isNull);
      expect(policy.formattedTotalPagado, r'$62,082.19');
    });

    test('unpaid receipt whose period ended before the cut-off is overdue', () {
      final r = policy.recibos[5];
      expect(r.statusOn(DateTime.utc(2026, 10, 31)), PaymentStatus.porVencer);
      expect(r.statusOn(DateTime.utc(2026, 12, 6)), PaymentStatus.vencido);
      expect(policy.recibos.first.statusOn(DateTime.utc(2027, 1, 1)), PaymentStatus.pagado);
    });
  });

  testWidgets('desktop shows the table without a checkbox column', (tester) async {
    await pumpAt(tester, const Size(1400, 1000));
    expect(find.byType(DataTable), findsOneWidget);
    expect(find.byType(Checkbox), findsNothing);
    expect(find.byType(ReceiptMobileCard), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('phone shows cards instead of the table', (tester) async {
    await pumpAt(tester, const Size(390, 844));
    expect(find.byType(DataTable), findsNothing);
    expect(find.byType(ReceiptMobileCard), findsWidgets);
    expect(tester.takeException(), isNull);
  });

  testWidgets('registering a payment marks the receipt paid', (tester) async {
    await pumpAt(tester, const Size(390, 844));
    expect(find.text('5 de 12 recibos cubiertos'), findsOneWidget);

    await tester.scrollUntilVisible(find.text('Recibo 6 / 12'), 300, scrollable: find.byType(Scrollable).first);
    await tester.tap(find.text('Recibo 6 / 12'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Registrar Pago de este Recibo'));
    await tester.pumpAndSettle();

    expect(find.text('Recibo 6 registrado como pagado el 31/10/2026'), findsOneWidget);
    await tester.scrollUntilVisible(find.text('6 de 12 recibos cubiertos'), -300, scrollable: find.byType(Scrollable).first);
    expect(find.text('6 de 12 recibos cubiertos'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
