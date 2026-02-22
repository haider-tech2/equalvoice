export default function PostCard({report}) {
  return (
    <div className="report-card">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <img src={report.authorPhoto} style={{width:40,height:40,borderRadius:"50%"}}/>
        <strong>{report.author}</strong>
        {report.pinned && <span className="pinned-badge">📌 Pinned</span>}
      </div>
      <h2>{report.title}</h2>
      <p>{report.description}</p>
    </div>
  )
}
