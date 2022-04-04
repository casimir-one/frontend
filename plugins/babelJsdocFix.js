const shiftJsdocComments = ({ node }) => {
  if (node.body.length) {
    const members = node.body;

    for (const [i, member] of members.entries()) {
      if (
        member.trailingComments?.length
        && member.trailingComments[0].loc.start.line > member.loc.end.line
      ) {
        const nextMember = members[i + 1];

        if (nextMember) {
          if (nextMember.leadingComments) {
            nextMember.leadingComments.unshift(...member.trailingComments);
          } else {
            nextMember.leadingComments = member.trailingComments;
          }
        }

        delete member.trailingComments;
      }
    }
  }
};

const plugin = {
  visitor: {
    ClassBody: shiftJsdocComments,
    BlockStatement: shiftJsdocComments,
    Program: shiftJsdocComments
  }
};

module.exports = () => plugin;
