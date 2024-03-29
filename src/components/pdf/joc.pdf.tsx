import React, { useEffect, useState } from 'react';
import { IS_DEV } from '@/constants';
import { JobOrder } from '@/types';
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

import * as customerService from '@/apis/customer.api';
import * as joService from '@/apis/jo.api';
import * as JOCService from '@/apis/joc.api';
import { getErrMessage } from '@/lib/utils';
import Loader from '@/components/table/loader';

Font.register({
  family: 'tahoma.ttf',
  fonts: [
    { src: '/fonts/tahoma.ttf' },
    { src: '/fonts/tahomaBold.ttf', fontWeight: 'bold' },
  ],
});
const styles = StyleSheet.create({
  page: {
    width: '100%',
    fontFamily: 'tahoma.ttf',
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
    width: 120,
    height: 30,
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
    fontWeight: 'bold',
    paddingVertical: 3,
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
    fontSize: 10,
  },
  tableColumnTwo: {
    borderBottom: '1px solid #000',
    paddingHorizontal: 12,
    fontSize: 10,
  },
  textParagrapf: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  headerF: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    marginTop: 20,
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
    fontSize: 8,
  },
  tableECell: {
    display: 'flex',
    flexDirection: 'row',
    borderLeft: '1px solid #000',
    borderRight: '1px solid #000',
    borderBottom: '1px solid #000',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '9px',
    paddingVertical: '5px',
    width: '100%',
    marginHorizontal: 'auto',
  },
});

type JOCPdfProps = {
  joc_no: string;
};

const JOPdf: React.FC<JOCPdfProps> = ({ joc_no }) => {
  //! get jo
  const jocQuery = useQuery({
    queryKey: ['joc', joc_no],
    queryFn: () => JOCService.getById(joc_no),
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const [customer, setCustomer] = useState<any | null>(null);
  const [jo, setJO] = useState<any | null>(null);

  useEffect(() => {
    if (jocQuery.data?.data?.customer_code) {
      customerService
        .getById(jocQuery.data.data.customer_code)
        .then((res) => {
          setCustomer(res.data);
        })
        .catch((error) => {
          console.error('Error fetching customer data:', error);
        });
    }
  }, [jocQuery.data?.data?.customer_code]);

  useEffect(() => {
    if (jocQuery.data?.data?.joc_no) {
      joService
        .getById(jocQuery.data.data.joc_no)
        .then((res) => {
          setJO(res.data);
        })
        .catch((error) => {
          console.error('Error fetching JO data:', error);
        });
    }
  }, [jocQuery.data?.data?.jo_no]);

  const datenya = new Date(`${jocQuery.data?.data.createdAt}`);
  const dateString = datenya.toDateString();

  const dateetd = new Date(`${jocQuery.data?.data.etd}`);
  const dateStringEtd = dateetd.toDateString();

  const dateeta = new Date(`${jocQuery.data?.data.eta}`);
  const dateStringEta = dateeta.toDateString();

  return jocQuery.isLoading ? (
    <div className="grid place-items-center">
      <Loader />
    </div>
  ) : jocQuery.isError ? (
    <p className="text-center text-destructive">Something went wrong...</p>
  ) : (
    <PDFViewer className="h-screen w-full" style={styles.textParagrapf}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.headTI}>
            <Image
              src="https://www.4shared.com/img/vmRC2Z1Zjq/s25/18bace30100/logo_neelo"
              style={styles.imgLogo}
            />
            <View style={styles.tableRow0}>
              <View>
                g pd
                <View style={styles.tablePad}>
                  <Text style={styles.textPad}>JO CONSOLIDATION</Text>
                </View>
                <View style={styles.tableUnderPad}>
                  <View style={styles.tableL}>
                    <Text style={styles.tableColumn}>JOC No</Text>
                    <Text style={styles.tableColumn}>Date</Text>
                    <Text style={styles.tableColumn}>Type</Text>
                  </View>
                  <View>
                    <Text style={styles.tableColumnTwo}>
                      {jocQuery.data.data.joc_no}
                    </Text>
                    <Text style={styles.tableColumnTwo}>{dateString}</Text>
                    <Text style={styles.tableColumnTwo}>
                      {jocQuery.data.data.type || '-'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.headerF}>
            <View>
              <Text>Agent : {jocQuery.data.data.agent}</Text>
              <Text>Loading : {jocQuery.data.data.loading}</Text>
              <Text>Discharge : {jocQuery.data.data.discharge}</Text>
              <Text>ETD : {dateStringEtd}</Text>
              <Text>ETA : {dateStringEta}</Text>
            </View>
            <View>
              <Text>No. HBL : </Text>
              <Text>No. MBL : {jocQuery.data.data.no_mbl}</Text>
              <Text>Vessel : {jocQuery.data.data.vessel}</Text>
              <Text>No. Container : {jocQuery.data.data.no_container}</Text>
            </View>
          </View>

          <View style={{ marginTop: 30 }}>
            <Text style={{ fontSize: 10, fontWeight: 'semibold' }}>
              DATA JO
            </Text>

            <View style={[styles.table, { marginBottom: '16px' }]}>
              {/* Columns */}
              <View style={[styles.tableRow, { fontWeight: 'bold' }]}>
                <View style={[styles.tableCol, { width: '5%' }]}>
                  <Text style={styles.tableCell}>No.</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>NO JO</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>CUSTOMER</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>NO MBL</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>CONSIGNEE</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>GW</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>MEAS</Text>
                </View>
              </View>
              {/* Rows */}
              {Array.isArray(jocQuery.data?.data?.joborder) &&
              jocQuery.data?.data?.joborder.length > 0 ? (
                jocQuery.data?.data?.joborder.map(
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
                          <Text style={styles.tableCell}>{item.jo_no}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                          <Text style={styles.tableCell}>{item.shipper}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                          <Text style={styles.tableCell}>{item.mbl}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                          <Text style={styles.tableCell}>{item.consignee}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                          <Text style={styles.tableCell}>0</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                          <Text style={styles.tableCell}>{''}</Text>
                        </View>
                      </View>
                    </>
                  )
                )
              ) : (
                <View style={styles.tableECell}>
                  <Text>No JOC data available</Text>
                </View>
              )}
            </View>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '80%',
              marginTop: 40,
              fontSize: 11,
            }}
          >
            <View>
              <Text>Created</Text>
              <Text style={{ fontSize: 10, marginTop: 80 }}>
                ({jocQuery.data.data.createdBy})
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 'auto',
              }}
            >
              <Text>Approved</Text>
              <Text style={{ fontSize: 10, marginTop: 80 }}>
                (...........................................)
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
export default JOPdf;
