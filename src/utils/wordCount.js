module.exports = {
  str: '',
  str_: '',
  judegOption(mb) {
    if (mb.val.length !== 1) {
      const endStr = mb.bm[mb.bm.length - 1]
      const swordK = mb.bm.replace(/[(_)\d]/g, '')
      if (mb.bm.indexOf('_') !== -1) {
        // mb['option']=''
      }
      if ('23456789'.indexOf(endStr) !== -1) {
        mb['option'] = endStr
      }
      mb['ys'] = `bm${swordK.length}`
    }
  }
}
