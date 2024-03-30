import { request } from "@umijs/max";
import { useRequest } from "@umijs/max";
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';
import remarkGfm from 'remark-gfm';// 划线、表、任务列表和直接url等的语法扩展
import rehypeRaw from 'rehype-raw';// 解析标签，支持html语法
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // 代码高亮
//高亮的主题，还有很多别的主题，可以自行选择
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Anchor } from "antd";
import { Link } from "@umijs/max";

export default () => {
    const [mdContent, setMdContent] = useState('');
    const [titles, setTitles] = useState<any>([]);
    const [anchorItems, setAnchorItems] = useState<any>([]);
  
    const addAnchor = () => {
        const ele = document.querySelector('div.markdown-body');
        let eid = 0;
        let titles = [];
        for (const e of ele.childNodes) {
            if (e.nodeName === 'H1' || e.nodeName === 'H2' || e.nodeName === 'H3' || e.nodeName === 'H4' || e.nodeName === 'H5' || e.nodeName === 'H6') {
                let a = document.createElement('a');
                a.setAttribute('id', '#' + eid);
                a.setAttribute('class', 'anchor-title');
                a.setAttribute('href', '#' + eid);
                a.innerText = ' '
                let title = {
                    type: e.nodeName,
                    id: eid,
                    name: e.innerText
                };
                titles.push(title);
                e.appendChild(a);
                eid++;
            }
        }
        setTitles(titles);
    }

    const handleClickFun = (e: any, link: any) => {
        e.preventDefault();
        if (link.href) {
            // 找到锚点对应得的节点
            let element = document.getElementById(link.href);
            // 如果对应id的锚点存在，就跳滚动到锚点顶部
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            element && element.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
    }

    const getAnchorItems = () => {
        let items: any[] = [];
        titles.map((t: any, index: number) => (
            items.push({
                href: '#' + t.id,
                title: t.name,
                key: index
            })
        ))
        setAnchorItems(items);
    }

    const getContainer: any = () => document.querySelector('#content-box');
 
    useEffect(() => {
        fetch('test.md')
             .then(res => res.text())
             .then(text => {
                setMdContent(text);
                setTimeout(addAnchor, 1000);
            });
      }, []);

      useEffect(() => {
        getAnchorItems();
      }, [titles]);
    
    return(
    <div style={{display: 'flex'}}>
        <Anchor
            className='markdown-nav'
            affix={false}
            onClick={handleClickFun}
            getContainer={getContainer}
            items={anchorItems}
        />
        <div id="content-box" style={{maxHeight: '100vh', overflow: 'auto'}}>
            <ReactMarkdown
             className='markdown-body'
            //  children={mdContent}
            //  remarkPlugins={[remarkGfm, { singleTilde: false }]}
             rehypePlugins={[rehypeRaw]}
             components={{
                 code({ node, inline, className, children, ...props }) {
                     const match = /language-(\w+)/.exec(className || '')
                     return !inline && match ? (
                         <SyntaxHighlighter
                            //  children={String(children).replace(/\n$/, '')}
                             style={tomorrow}
                             language={match[1]}
                             PreTag="div"
                             {...props}
                         >
                            {String(children).replace(/\n$/, '')}
                         </SyntaxHighlighter>
                     ) : (
                         <code className={className} {...props}>
                             {children}
                         </code>
                     )
                 }
             }}
            >
                {mdContent}
            </ReactMarkdown>
        </div>
    </div>)
}
