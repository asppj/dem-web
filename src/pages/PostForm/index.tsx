import TabPane from '@ant-design/pro-card/lib/components/TabPane'
import Field from '@ant-design/pro-form/lib/components/Field'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Col, Descriptions, Input, Row, Select, Tabs } from 'antd'
import React, { ChangeEvent, forwardRef, useRef } from 'react'
import { useImperativeHandle } from 'react'
import { ReactElement, useState } from 'react'
import styles from './index.less'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { request } from 'umi'





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
  // body
  const [requestBody, setRequestBody] = useState(prop.data.body)
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
      console.log("reponse:", err);
    })
  }

  return (<>
    <Row>
      <Col span={14}>
        <Row gutter={[16, 16]}>
          <Col span={2}>
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
          <Col span={10}>
            <Input addonBefore="网址" value={URL} onChange={(e) => { onChangeURL(e.target.value) }} />
          </Col>
        </Row>
        <Row gutter={[16, 16]} >
          <Col span={2}><span className={styles.headerSpan}>Headers</span></Col>
          <Col span={14}>
            {
              prop.data.headers.map((item, index) => {
                return (
                  <Row key={`row${index}`} gutter={[14, 14]}>
                    <Col span={8}><Input defaultValue={item[0]}></Input></Col>
                    <Col span={8}><Input defaultValue={item[1]}></Input></Col>
                  </Row>
                )
              })
            }
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={2}>
            Body
          </Col>
          <Col span={14}>
            <Input.TextArea className={styles.requestBody}
              value={requestBody}
              allowClear
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                console.log("编辑body", e.target.value)
                setRequestBody(e.target.value)
              }}

            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Button type="primary" onClick={requestClick}>发送请求</Button>
        </Row>


        {
          prop.data.headers.map((headers: string[]) => {
            return (
              <>
                <h3>
                  <span>{headers[0]}</span>
                  <span>:</span>
                  <span>{headers[1]}</span>
                </h3>
              </>
            )
          })
        }
      </Col>
      <Col span={8}>
        <span className={styles.response}>{responseText}</span>
      </Col>
    </Row>
  </>)
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
    console.log("激活key:", k)
  };
  // 新增
  const onAdd = () => {
    const newKey = newAcKey()
    console.log("新key:", newKey)
    paneTabs.map((pane: TabPaneParams) => {
      if (pane.key === activeKey) {
        // 设置可关闭
        const newPane = new TabPaneParams(`${defaultActivityKey}-${newKey}`, `${newKey}`, pane.child)
        newPane.setCloseable(true)
        // 复制当前页参数
        setPaneTabs([...paneTabs, newPane])
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
        defaultActiveKey={activeKey}
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


function sync() {
  throw new Error('Function not implemented.')
}

