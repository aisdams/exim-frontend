import { Quotation } from '@/types';
import {
  Document,
  Text,
  View,
  Page,
  PDFViewer,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';
import { toast } from 'react-toastify';
import { IS_DEV } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import * as quotationService from '@/apis/quotation.api';
import { getErrMessage } from '@/lib/utils';
import Loader from '@/components/table/loader';

import React, { useState } from 'react';

Font.register({
  family: 'DustismoRoman',
  fonts: [
    { src: '/fonts/DustismoRoman.ttf' },
    { src: '/fonts/DustismoRomanBold.ttf', fontWeight: 'bold' },
  ],
});
const styles = StyleSheet.create({
  page: {
    width: '100%',
    fontFamily: 'DustismoRoman',
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
  },
  tablePad: {
    borderBottom: '1px solid #000',
  },
  textPad: {
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
  },
  tableColumn: {
    borderBottom: '1px solid #000',
    paddingHorizontal: 12,
  },
  tableColumnTwo: {
    borderBottom: '1px solid #000',
    paddingHorizontal: 12,
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
    width: '13%',
  },
  textHeadFour: {
    marginVertical: 10,
    fontSize: 9,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  textFinally: {
    marginTop: 80,
    fontSize: 9,
  },
  textS: {
    fontSize: 9,
  },
  viewHr: {
    backgroundColor: '#000',
    width: 40,
    height: 'auto',
  },
});
interface ItemCost {
  qty: number; // Ganti dengan tipe data yang sesuai dengan data qty
  // Tambahkan properti lain sesuai kebutuhan
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
  console.log('item_cost:', quotationQuery.data?.data?.item_cost);

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
                    <Text style={styles.tableColumnTwo}>2023-08-24</Text>
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
                {quotationQuery.data.data.customer}
              </Text>
              <Text style={styles.textHeadTwo}>
                Jl.Wijaya XI,No.X AB Kebayoran Baru Jakarta Selatan
              </Text>
            </View>

            <View>
              <Text style={styles.textHeadThree}>
                Attn. {quotationQuery.data.data.attn}
              </Text>
              <Text style={styles.textHead}>Re. CUSTOMS CLEARANCE SEA</Text>
              <Text style={styles.textHeadFour}>
                We are pleased to quote you the following :
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
              <View style={[styles.tableRow, { fontWeight: 'normal' }]}>
                <View style={[styles.tableCol, { width: '5%' }]}>
                  <Text style={styles.tableCell}>1</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>
                    {typeof quotationQuery.data?.data?.item_cost === 'object' &&
                    'qty' in quotationQuery.data.data.item_cost
                      ? quotationQuery.data.data.item_cost.qty
                      : 'N/A'}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>
                    {typeof quotationQuery.data?.data?.item_cost === 'string'
                      ? quotationQuery.data.data.item_cost
                      : 'N/A'}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>
                    {quotationQuery.data.data.item_cost}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>
                    {Array.isArray(quotationQuery.data?.data?.item_cost)
                      ? quotationQuery.data.data.item_cost
                          .map((item) => item.qty)
                          .join(', ')
                      : 'N/A'}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>
                    {quotationQuery.data.data.item_cost}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>
                    {quotationQuery.data.data.item_cost}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.textTableUnder}>
              Will be happy to supply and any further information you may need
              and trust that you call on us to fill your order which will
              receive our prompt and careful attention.
            </Text>

            <View style={styles.secApprov}>
              <Text>Yours Faithfully</Text>
              <View>
                <Text>Approved By,</Text>
                <Text>{quotationQuery.data.data.customer}</Text>
              </View>
            </View>

            <View style={styles.textFinally}>
              <Text style={styles.textS}>SALES 2</Text>
              <View style={styles.viewHr} />
              <Text>Mobile : 0893</Text>
              <Text>Email : b@yahoo.com</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
export default QuotationPdf;
