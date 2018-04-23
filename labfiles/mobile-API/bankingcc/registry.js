module.exports = {
  components: {
  // FinancialBot
  'BalanceRetrieval': require('./banking/balance_retrieval'),
  'TrackSpending': require('./banking/track_spending'),
  'Payments': require('./banking/payments'),
  'HotelList': require('./reservation/get_hotel_list'),  

  // Utility components
    'ActionFromVariable': require('./util/action_from_variable'),
    'SetVariablesFromFile': require('./util/set_variables_from_file'),
    'SetVariableFromEntityMatches': require('./util/set_variable_from_entity_matches'),
    'OutputVariables': require('./util/output_variables'),
    'ConditionalIsNull': require('./util/conditional_is_null')
  }
};
