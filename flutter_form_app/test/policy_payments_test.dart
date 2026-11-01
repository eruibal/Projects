import 'package:flutter/material.dart';
import 'package:flutter_form_app/main.dart';
import 'package:flutter_form_app/poliza/data.dart';
import 'package:flutter_form_app/poliza/format.dart';
import 'package:flutter_form_app/poliza/policy_screen.dart';
import 'package:flutter_test/flutter_test.dart';

const swipeHint = 'Desliza la tabla para ver fecha, forma de pago y complemento.';

Future<void> pumpAt(WidgetTester tester, Size size, Widget app) async {
  tester.view.physicalSize = size;
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(app);
  await tester.pumpAndSettle();
}

void main() {
  test('demo totals add up', () {
    expect(formatMxn(samplePolicy.annualTotal), r'$145,992.87');
    expect(formatMxn(samplePolicy.paidTotal), r'$62,082.19');
    expect(formatMxn(samplePolicy.balance), r'$83,910.68');
    expect(samplePolicy.receipts.map((r) => r.daysBeforePeriodEnd).take(5), [4, 1, 4, 3, 6]);
    expect(samplePolicy.nextDue!.number, 6);
  });

  testWidgets('desktop: table stretches with no sideways scroll', (tester) async {
    await pumpAt(tester, const Size(1400, 1100), const MaterialApp(home: PolicyPaymentsScreen()));
    expect(find.text('Complemento de pago'), findsOneWidget);
    expect(find.text(swipeHint), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('phone: still a table, scrolls sideways', (tester) async {
    await pumpAt(tester, const Size(390, 844), const MaterialApp(home: PolicyPaymentsScreen()));
    expect(find.text('Estatus'), findsOneWidget);
    expect(find.text(swipeHint), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('form page links to the policy screen', (tester) async {
    await pumpAt(tester, const Size(1200, 1400), const CloudDataFormApp());
    await tester.tap(find.text('View Policy Payments (Adaptive Table)'));
    await tester.pumpAndSettle();
    expect(find.byType(PolicyPage), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
