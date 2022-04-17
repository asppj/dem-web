import TabPane from '@ant-design/pro-card/lib/components/TabPane'
import { Button, Col, Input, Radio, Row, Select, Tabs } from 'antd'
import React, { forwardRef, useEffect, useRef } from 'react'
import { useImperativeHandle } from 'react'
import { useState } from 'react'
import styles from './index.less'
import { request } from 'umi'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { encrypt } from '@/util/crypto'

import { Controlled as CodeMirror } from 'react-codemirror2'
import MonacoEditor from 'react-monaco-editor'
import { Editor } from './components/RequestForm'
import { Field } from 'rc-field-form'


export class PostFormData {
  method: string
  url: string
  headers: string[][]
  body: string
  constructor(method: string, url: string, headers: string[][], body: string) {
    this.method = method
    this.url = url
    this.headers = headers
    this.body = body
  }
}


const PostFromItem: React.FC<{ data: PostFormData }> = forwardRef((prop, ref) => {
  if (prop) {
    console.log(prop)
  }
  // 加解密
  const [enSecret, setEnSecret] = useState("") // 加密key
  const [deSecret, setDeSecret] = useState("") // 解密key
  // response 格式化，解密
  const [cryptRadio, setCyrptRadio] = useState(false);
  const [jsonFormatRadio, setJsonFormatRadio] = useState(false);
  const joinCurlBody = (url: string, method: string, headers: string[][], body: string) => {
    let curl = `curl -X ${method} ${url}`

    headers.map((header: string[]) => {
      if (header.length === 2) {
        if (header[0] != "") {
          curl += ` -H "${header[0]}: ${header[1]}"`
        }
      }
    });
    if (body != "") {
      if (cryptRadio) {
        curl += ` -d '${encrypt(body, enSecret)}'`
      } else {
        curl += ` -d '${body}'`
      }
    }
    return curl
  }

  // 拼接curl
  const [curlBody, setCurlBody] = useState('')

  useImperativeHandle(ref, () => ({
    save: () => {
      // TODO: storage
    }
  }))
  // method
  const methodMap = {
    "GET": "GET",
    "POST": "POST",
    "PUT": "PUT",
    "DELETE": "DELETE",
    "PATCH": "PATCH",
    "HEAD": "HEAD",
    "OPTIONS": "OPTIONS",
    "TRACE": "TRACE",
  }
  const [method, setMethod] = useState(prop.data.method);
  const onChangeMethod = (e: string) => {
    console.log("Method:", e);
    setMethod(e)
  }
  // url
  const [URL, setURL] = useState(prop.data.url);
  const onChangeURL = (e: string) => {
    setURL(e)
  }
  const [headers, setHeaders] = useState(prop.data.headers);
  const addHeader = () => {
    console.log("Add Header");
    setHeaders([...headers, ["", ""]])
  }
  const removeHeader = (index: number) => {
    console.log("Remove:", index);
    setHeaders(headers.filter((_, i) => i !== index))
  }
  const changeHeader = (i: number, j: number, e: string) => {
    headers[i][j] = e
    setHeaders([...headers])
  }
  // body
  const [requestBody, setRequestBody] = useState(prop.data.body || '{\n\n}')
  // body加密
  const [bodyEncrypt, setBodyEncrypt] = useState(false)
  const onChangeBodyEncrypt = () => {
    console.log("Body Encrypt:", bodyEncrypt);
    setBodyEncrypt(!bodyEncrypt)
  }
  // const bodyOption = {
  //   mode: 'xml',
  //   theme: 'material',
  //   lineNumbers: true
  // }
  //response
  const [responseText, setResponseText] = useState("")
  const requestClick = async () => {
    const requestOption = {}
    // const res = await request<{ data: API.CurrentUser }>(URL, {
    //   method: method,
    //   ...(requestOption || {}),
    // });
    // console.log(res.data);
    // setResponseText("res.data")
    request<{ data: API.CurrentUser }>(URL, {
      method: method,
      ...(requestOption || {}),
    }).then(res => {
      console.log(res.data);
      setResponseText("res.data")
    }).catch(err => {
      console.log("response:", err);
    })
  }

  const [ftRes, setFtRes] = useState("");
  // 转换response
  const translateFunc = (res: string) => {
    let r = res
    if (cryptRadio) {
      r = encrypt(res, deSecret)
    }

    if (jsonFormatRadio) {
      // TODO: 格式化输出
    }

    return r
  }
  // curl 拼接curl
  useEffect(() => {
    setCurlBody(joinCurlBody(URL, method, headers, requestBody))
    if (responseText != "") {
      const f = translateFunc(responseText);
      if (f != "") {
        setFtRes(f)
      }

    }
  }, [URL, method, headers, requestBody])

  return (<div className={styles.container}>
    <Row gutter={[12, 12]}>
      <Col span={6}>
        <Input size={"small"} allowClear addonBefore="Body加密Secret" value={enSecret} onChange={(e) => { setEnSecret(e.target.value) }}></Input>
      </Col>
      <Col span={6}>
        <Input size={"small"} allowClear addonBefore="Response解密Secret" value={deSecret} onChange={(e) => { setDeSecret(e.target.value) }}></Input>

      </Col>

    </Row>
    <Row gutter={[16, 16]} >
      <Col span={12} >
        <Row gutter={[24, 24]}>
          <Col span={4}>
            <Select value={method} className={styles.methodSelect} onChange={onChangeMethod}>
              {
                Object.keys(methodMap).map((key) => {
                  return <Select.Option key={key} value={key}>{
                    methodMap[key] == "GET" ? "GET" : <span className={styles.methodSpanInfo}>{methodMap[key]}</span>
                  }</Select.Option>
                })
              }
            </Select>
          </Col>
          <Col span={20}>
            <Input addonBefore="网址" value={URL} onChange={(e) => { onChangeURL(e.target.value) }} />
          </Col>
        </Row>
        <Row gutter={[24, 24]} >
          <Col span={4}><span className={styles.headerSpan}>Headers</span></Col>
          <Col span={20}>
            {
              headers.map((item, index) => {
                return (
                  <Row key={`row${index}`} gutter={[24, 24]}>
                    <Col span={8}><Input defaultValue={item[0]} onChange={(e) => { changeHeader(index, 0, e.target.value) }}></Input></Col>
                    <Col span={8}><Input defaultValue={item[1]} onChange={(e) => { changeHeader(index, 1, e.target.value) }}></Input></Col>
                    <Col span={1}>{index === headers.length - 1 ? <PlusOutlined onClick={addHeader} /> : < MinusOutlined onClick={() => { removeHeader(index) }} />}</Col>
                  </Row>
                )
              })
            }
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={2}>
            Body
          </Col>
          <Col span={2}>
            <Radio onClick={onChangeBodyEncrypt} checked={bodyEncrypt}>
              加密Body
            </Radio>
          </Col>
          <Col span={14}>
            <Input.TextArea className={styles.requestBody}
              value={requestBody}
              allowClear
              autoSize
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                console.log("编辑body", e.target.value)
                setRequestBody(e.target.value)
              }}

            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          {/* <Col offset={12} span={2}>
            <Button type="primary" onClick={requestClick}>发送请求</Button>
          </Col> */}
        </Row>
        <br />

        <Row gutter={[24, 24]}>
          {/* 返回值渲染 */}

          <Col><span>Response:</span></Col>
          <Col span={20}>
            <Row gutter={[24, 24]}>
              <Col offset={1} span={4}>
                <Button type="primary" onClick={requestClick}>发送请求</Button>
              </Col>
              <Col span={4}><Radio type="default" checked={cryptRadio} onClick={() => { setCyrptRadio(!cryptRadio) }}>crypts解密</Radio></Col>
              <Col span={4}><Radio type="default" checked={jsonFormatRadio} onClick={() => { setJsonFormatRadio(!jsonFormatRadio) }}>json格式化</Radio></Col>
              <Col span={4}></Col>
            </Row>
            <Row>
              <Col className={styles.response} span={24}>
                <span className={styles.response}>{responseText}</span>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={12}>
        {
          // <div className={styles.response}>{responseText}</div>
        }
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Input.TextArea autoSize className={styles.codeMirror} value={curlBody} />
          </Col>
        </Row>
        <Row >
          <code className={styles.responseFotmat}>{ftRes}</code>
        </Row>
      </Col>
    </Row>
  </div>)
})
class TabPaneParams {
  title: string
  key: string
  child: PostFormData
  closable: boolean
  constructor(title: string, key: string, child: PostFormData) {
    this.title = title
    this.key = key
    this.child = child
    this.closable = false // 默认不能关
  }
  // 设置可关闭
  setCloseable(closable: boolean) {
    this.closable = closable
  }
}

const PostForm: React.FC = () => {
  const childrenRes = useRef()
  // 默认key
  const defaultActivityKey = "New Tab"
  const [acKey, setAcKey] = useState(1)
  // 新key
  const newAcKey = () => {
    setAcKey(acKey + 1)
    return acKey
  }
  // TODO: localstorage读配置
  // 初始化
  const postJson: string[] = ["content-type", "application/json"]
  const defaultTab = new PostFormData("GET", "https://prometheus-service.atcloudbox.com/config", [postJson], "");
  const [paneTabs, setPaneTabs] = useState<TabPaneParams[]>([new TabPaneParams(defaultActivityKey, defaultActivityKey, defaultTab)]);
  const [activeKey, setActiveKey] = useState(defaultActivityKey);
  const onChange = (k: string) => {
    setActiveKey(k)
    console.log("激活key:", k)
  };
  // 新增
  const onAdd = () => {
    const newKey = newAcKey()
    paneTabs.map((pane: TabPaneParams) => {
      if (pane.key === activeKey) {
        // 设置可关闭
        const newPane = new TabPaneParams(`${defaultActivityKey}-${newKey}`, `${newKey}`, pane.child)
        newPane.setCloseable(true)
        // 复制当前页参数
        setPaneTabs([...paneTabs, newPane])
        setActiveKey(`${newKey}`)
      }
    })
  }
  // 删除

  const onRemove = (key: string) => {
    console.log("删除key:", key)
    setPaneTabs(paneTabs.filter((pane: TabPaneParams) => pane.key !== key))
  }
  // 编辑
  const onEdit = (e: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    console.log(e, action)

    if (action === "add") {
      onAdd()
    }
    if (action === "remove") {
      onRemove(e as string)
    }
  }

  return (
    <>
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
      >
        {paneTabs.map((pane: TabPaneParams) => (
          <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
            <PostFromItem data={pane.child} ref={childrenRes} />
          </TabPane>
        ))}
      </Tabs>
    </>
  )
}

export default PostForm;

