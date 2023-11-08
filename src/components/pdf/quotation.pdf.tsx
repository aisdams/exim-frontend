import React, { useEffect, useState } from 'react';
import { IS_DEV } from '@/constants';
import { Cost, Quotation } from '@/types';
import {
  Document,
  Font,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import * as costService from '@/apis/cost.api';
import * as CostService from '@/apis/cost.api';
import * as customerService from '@/apis/customer.api';
import * as quotationService from '@/apis/quotation.api';
import { getErrMessage } from '@/lib/utils';
import Loader from '@/components/table/loader';

Font.register({
  family: 'tahoma',
  fonts: [
    { src: '/fonts/tahoma.ttf' },
    { src: '/fonts/tahomaBold.ttf', fontWeight: 'bold' },
  ],
});
const styles = StyleSheet.create({
  page: {
    width: '100%',
    fontFamily: 'tahoma',
    fontSize: 12,

    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 69,
  },
  headTI: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imgLogo: {
    width: 220,
    height: 80,
  },
  // IN HEREEE
  tableRow0: {
    borderLeft: '1px solid #000',
    borderRight: '1px solid #000',
    borderTop: '1px solid #000',
    display: 'flex',
    flexDirection: 'column',
  },
  tablePad: {
    borderBottom: '1px solid #000',
  },
  textPad: {
    fontWeight: 'bold',
    marginHorizontal: 'auto',
    textAlign: 'center',
    alignItems: 'center',
  },
  tableUnderPad: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 'auto',
    justifyContent: 'center',
    textAlign: 'center',
  },
  tableL: {
    borderRight: '1px solid #000',
    fontSize: 9,
  },
  tableColumn: {
    borderBottom: '1px solid #000',
    paddingHorizontal: 12,
  },
  tableColumnTwo: {
    borderBottom: '1px solid #000',
    paddingHorizontal: 12,
    fontSize: 9,
  },
  topMargin: {
    marginTop: 40,
  },
  textHead: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  textHeadTwo: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: 'bold',
    width: '13%',
  },
  textHeadThree: {
    marginVertical: 15,
    fontSize: 9,
    fontWeight: 'bold',
    width: 'auto',
  },
  textHeadFour: {
    marginVertical: 10,
    fontSize: 9,
  },
  textParagrapf: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    backgroundColor: '#e1e3f5',
  },
  tableCol: {
    width: '22%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  amount: {
    position: 'relative',
  },
  amountText: {
    position: 'absolute',
    borderLeft: '1px solid #000',
    borderRight: '1px solid #000',
    borderBottom: '1px solid #000',
    backgroundColor: '#e1e3f5',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 167,
    paddingHorizontal: 12,
    top: 0,
    right: '15%',
    fontSize: 10,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
  },
  header: {
    fontSize: 12,
    textAlign: 'center',
    color: 'grey',
    backgroundColor: 'yellow',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  secApprov: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  // ADDD IN HEREE DONT FORGET
  textTableUnder: {
    marginTop: 20,
    fontSize: 9,
  },
  textFinally: {
    marginTop: 80,
    fontSize: 9,
  },
  textS: {
    width: 'auto',
    fontSize: 9,
  },
  viewHr: {
    backgroundColor: '#000',
    width: 40,
    height: 'auto',
  },
});
interface ItemCost {
  qty: number;
}

type QuotationPdfProps = {
  quo_no: string;
};

const QuotationPdf: React.FC<QuotationPdfProps> = ({ quo_no }) => {
  //! get quotation
  const quotationQuery = useQuery({
    queryKey: ['quotation', quo_no],
    queryFn: () => quotationService.getById(quo_no),
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  console.log(quo_no);
  const datenya = new Date(`${quotationQuery.data?.data.createdAt}`);
  const dateString = datenya.toDateString();

  const [cost, setCost] = useState<Cost[]>([]);
  const [costDataTwo, setCostDataTwo] = useState<any | null>(null);
  const [customer, setCustomer] = useState<any | null>(null);

  const costData = quotationQuery.data?.data?.cost;
  let totalPrices = 0;

  if (Array.isArray(costData)) {
    totalPrices = costData.reduce((total, item) => {
      const price = parseFloat(item.price);
      return total + price;
    }, 0);
  }

  useEffect(() => {
    if (quotationQuery.data?.data?.customer_code) {
      customerService
        .getById(quotationQuery.data.data.customer_code)
        .then((res) => {
          setCustomer(res.data);
        })
        .catch((error) => {
          console.error('Error fetching customer data:', error);
        });
    }
  }, [quotationQuery.data?.data?.customer_code]);

  useEffect(() => {
    if (quotationQuery.data?.data?.quo_no) {
      CostService.getById(quotationQuery.data.data.quo_no)
        .then((res) => {
          setCostDataTwo(res.data);
        })
        .catch((error) => {
          console.error('Error fetching quotation data:', error);
        });
    }
  }, [quotationQuery.data?.data?.quo_no]);

  return quotationQuery.isLoading ? (
    <div className="grid place-items-center">
      <Loader />
    </div>
  ) : quotationQuery.isError ? (
    <p className="text-center text-destructive">Something went wrong...</p>
  ) : (
    <PDFViewer className="h-screen w-full" style={styles.textParagrapf}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.headTI}>
            <Image
              src="https://i.ibb.co/JmVLcR2/logo.png"
              style={styles.imgLogo}
            />
            <View style={styles.tableRow0}>
              <View>
                <View style={styles.tablePad}>
                  <Text style={styles.textPad}>QUOTATIONS</Text>
                </View>
                <View style={styles.tableUnderPad}>
                  <View style={styles.tableL}>
                    <Text style={styles.tableColumn}>Quo No</Text>
                    <Text style={styles.tableColumn}>Date</Text>
                    <Text style={styles.tableColumn}>Kurs</Text>
                  </View>
                  <View>
                    <Text style={styles.tableColumnTwo}>
                      {quotationQuery.data.data.quo_no}
                    </Text>
                    <Text style={styles.tableColumnTwo}>{dateString}</Text>
                    <Text style={styles.tableColumnTwo}>
                      {quotationQuery.data.data.kurs}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.topMargin}>
            <View>
              <Text style={styles.textHead}>
                {customer ? customer.partner_name : ''}
              </Text>
              <Text style={styles.textHeadTwo}>
                {customer ? customer.address : ''}
              </Text>
            </View>

            <View>
              <Text style={styles.textHeadThree}>
                Attn. {quotationQuery.data.data.attn}
              </Text>
              <Text style={styles.textHead}>Re. CUSTOMS CLEARANCE SEA</Text>
              <Text style={styles.textHeadFour}>
                {quotationQuery.data.data.valheader}
              </Text>
            </View>

            {/* Table Items */}
            <View style={[styles.table, { marginBottom: '16px' }]}>
              {/* Columns */}
              <View style={[styles.tableRow, { fontWeight: 'bold' }]}>
                <View style={[styles.tableCol, { width: '5%' }]}>
                  <Text style={styles.tableCell}>No.</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>Items</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>QTY</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>Unit</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>Price</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>Amount</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>Remarks</Text>
                </View>
              </View>
              {/* Rows */}

              {Array.isArray(quotationQuery.data?.data?.cost) ? (
                quotationQuery.data?.data?.cost.map(
                  (item: any, index: number) => (
                    <>
                      <View
                        style={[styles.tableRow, { fontWeight: 'normal' }]}
                        key={index}
                      >
                        <View style={[styles.tableCol, { width: '5%' }]}>
                          <Text style={styles.tableCell}>{index + 1}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                          <Text style={styles.tableCell}>{item.item_name}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                          <Text style={styles.tableCell}>{item.qty}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                          <Text style={styles.tableCell}>{item.unit}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                          <Text style={styles.tableCell}>{item.price}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                          <Text style={styles.tableCell}>Rp. {item.price}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                          <Text style={styles.tableCell}>{''}</Text>
                        </View>
                      </View>

                      <View style={styles.amount}>
                        <View style={styles.amountText}>
                          <Text>Total:</Text>
                          <Text>Rp. {totalPrices}</Text>
                        </View>
                      </View>
                    </>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={4}>No cost data available</td>
                </tr>
              )}
            </View>

            <Text style={styles.textTableUnder}>
              {quotationQuery.data.data.valfooter}
            </Text>

            <View style={styles.secApprov}>
              <Text>Yours Faithfully</Text>
              <View>
                <Text>Approved By,</Text>
                <Text>{customer ? customer.partner_name : ''}</Text>
              </View>
            </View>

            <View style={styles.textFinally}>
              <Text style={styles.textS}>{quotationQuery.data.data.sales}</Text>
              <View style={styles.viewHr} />
              <Text>Mobile : 08123456789</Text>
              <Text>Email : b@yahoo.com</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
export default QuotationPdf;
